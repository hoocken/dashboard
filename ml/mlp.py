import numpy as np
import tensorflow as tf
import keras

tf.keras.datasets.mnist.load_data(path="mnist.npz")
(x_train, y_train), (x_test, y_test) = keras.datasets.mnist.load_data()

class MLP:
    def __init__(self):
        self.LAYER_WIDTH = [256, 64, 64, 10]
        self.LAYER_DEPTH = len(self.LAYER_WIDTH)
        self.NUM_CLASSES = self.LAYER_WIDTH[-1]
        self.W = [(np.random.rand(self.LAYER_WIDTH[i + 1], (self.LAYER_WIDTH[i] + 1)) * 2 - 1) * 0.1 for i in range(0, self.LAYER_DEPTH - 1)]
        self.delta_w_old = [0] * (self.LAYER_DEPTH - 1)
        
        # Constants
        self.E = 1000
        self.LAMBDA = 0.00001    # if not small enough, the lines seems to run off somewhere else. Depends on network size and data
                            # if data is in a big scale i.e. 100 or more having bigger lambda ensures small weights and less chance of saturation
        self.ALPHA = 0.5  # for momentum
        self.p = 0.5 # for dropout
        self.ETA = 0.1 # for adaptive learning rate
        self.ETA_p = 0.01
        self.ETA_m = 0.1

        for i in range(1000):
            # print(x_train[i], y_train[i])
            self.train(x_train[i], y_train[i])

    @staticmethod
    def softmax(o: np.ndarray):
        """Softmax Funktion"""
        return np.array([np.exp(o[i])/np.sum(np.exp(o)) for i in range(len(o))]) 

    @staticmethod
    def sigmoid(o: np.ndarray):
        """Sigmoid Funktion"""
        return np.array([1./(1+ np.exp(-o[i]))  if -o[i] <= 700 else 0. for i in range(len(o))])
    
    def local_binary_pattern(self, img: np.ndarray):
        binary_pattern_image = np.zeros_like(img)
        for i in range(1, len(img) - 1):
            for j in range(1, len(img[i]) - 1):
                bp = [0] * 8
                bp[0] = img[i - 1][j - 1] > img[i][j]
                bp[1] = img[i - 1][j] > img[i][j]
                bp[2] = img[i - 1][j + 1] > img[i][j]
                bp[3] = img[i][j + 1] > img[i][j]
                bp[4] = img[i + 1][j + 1] > img[i][j]
                bp[5] = img[i + 1][j] > img[i][j]
                bp[6] = img[i + 1][j - 1] > img[i][j]
                bp[7] = img[i + 1][j] > img[i][j]
                binary = 0
                for x in range(8):
                    binary *= 2
                    binary += bp[x]
                    
                binary_pattern_image[i][j] = binary

        return binary_pattern_image
    
    def lbp_feat(self, local_binary_pattern_image: np.ndarray):
        feat = [0] * 256
        num, count = np.unique(local_binary_pattern_image, return_counts=True)
        lbp_features = dict(zip(num, count))
        for i in range(256):
            if i in lbp_features:
                feat[i] = lbp_features[i]
        return feat

    def train(self, img: np.ndarray, res):
        img = self.local_binary_pattern(img)
        x = self.lbp_feat(img)
        # print(img)

        # Forward pass
        X = np.insert(x, 0, 1.)
        Z = [X]

        for j in range(0, self.LAYER_DEPTH - 2):
            # print(self.W[j], Z[j])
            O = self.W[j] @ Z[j]
            Z_j = MLP.sigmoid(O)
            Z_j = np.insert(Z_j, 0, 1.)
            Z.append(Z_j)
        
        O = self.W[self.LAYER_DEPTH - 2] @ Z[self.LAYER_DEPTH - 2]
        Z_last = MLP.softmax(O)
        Z.append(np.insert(Z_last, 0, 0.))  # add bias only for training, just to make code cleaner

        W_new = [w.copy() for w in self.W]
        
        # Backwards pass
        # delta E / delta z^2
        r = np.array([0] * self.NUM_CLASSES)
        r[res] = 1
        grad_o_last = r - Z_last
        print(grad_o_last)
        grad_o = [grad_o_last]

        E_new = -np.sum(r * np.log(Z_last))
        
        # Adaptive learn rate
        if E_new < self.E:
            self.ETA += self.ETA_p
        else:
            self.ETA -= self.ETA_m * self.ETA

        self.E = E_new
        
        grad_w_last = np.outer(grad_o_last, Z[self.LAYER_DEPTH - 2])

        delta_w = self.ETA * grad_w_last - self.LAMBDA * self.W[-1] + self.ALPHA * self.delta_w_old[-1]
        W_new[-1] = W_new[-1] + delta_w 
        delta_w_arr = [delta_w]

        for l in range(self.LAYER_DEPTH - 2, 0, -1): # Start from second to last for delta W.
            Z_l = Z[l][1:]          # Skip bias
            W_l = self.W[l][:, 1:]       # Skip bias
            grad_o_vector = grad_o[-1] @ W_l
            grad_o_l = (grad_o_vector) * Z_l * (1 - Z_l)
            
            grad_o.append(grad_o_l)
            
            grad_w_lm1 = np.outer(grad_o_l, Z[l - 1])
            
            delta_w =  self.ETA * grad_w_lm1 - self.LAMBDA * self.W[l - 1] + self.ALPHA * self.delta_w_old[l - 1]
            delta_w_arr.insert(0, delta_w)

            W_new[l - 1] = W_new[l-1] + delta_w 
        

        self.W = W_new
        self.delta_w_old = delta_w_arr


        