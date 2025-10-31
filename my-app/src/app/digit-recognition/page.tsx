'use client';

import Image from "next/image";
import styles from "../page.module.css";
import { useState } from "react";
import Whiteboard from '@/app/digit-recognition/whiteboard'

export default function Home() {

  
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.header}> Whiteboard </h1>
        <p>Use a multi-layered perceptron to recognize digits.</p>
        <Whiteboard />
        
      </main>
    </div>
  );
}
