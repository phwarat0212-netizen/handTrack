# ✨ HandTrack: Real-Time Neural Gesture Drawing Studio

> An elegant, Apple-inspired web studio that transforms your webcam into a canvas, allowing you to paint and interact in mid-air using neural hand landmark detection.
>
> สตูดิโอวาดรูปกลางอากาศสุดล้ำในเบราว์เซอร์ ที่แปลงกล้องเว็บแคมของคุณให้กลายเป็นผืนผ้าใบสร้างสรรค์ผลงานด้วยปัญญาประดิษฐ์และโครงข่ายประสาทเทียมตรวจจับโครงมือแบบเรียลไทม์

---

## 🚀 LIVE PLAY LINK / ลิงก์สำหรับเข้าเล่นทันที

🎯 **Experience the magic here / สัมผัสความล้ำได้ที่นี่:**  
👉 **[phwarat0212-netizen.github.io/handTrack/](https://phwarat0212-netizen.github.io/handTrack/)**

---

## 📸 Key Features / ฟังก์ชันเด่นสุดล้ำ

* 🎨 **Air Drawing (การวาดเขียนกลางอากาศ):** 
  Draw smooth, fluid, and sharp lines in mid-air by simply raising and pointing your index finger!  
  *ลากเส้นพู่กันกลางอากาศได้อย่างลื่นไหลและคมชัด เพียงชูนิ้วชี้ของคุณขึ้นมาวาดเขียนหน้ากล้อง!*

* 🦴 **Futuristic Hand Skeleton Overlay (โครงกระดูกมือนีออนเรดาร์):** 
  See a gorgeous glowing neon-cyan skeletal grid (`rgba(0, 242, 255, 0.55)`) and bright node joints tracked over your hands in real-time, giving a futuristic cyber-hologram feel.  
  *ตื่นตากับโครงข่ายกระดูกมือนีออนสีฟ้าเรืองแสงและจุดตัดข้อต่อสีขาวสว่าง ที่วิ่งตรวจจับตามมือจริงของคุณทุกข้อนิ้วในแบบเรียลไทม์สไตล์ไซไฟสุดไฮเทค!*

* 📈 **Butter-Smooth EMA Filter (ตัวกรองลายเส้นนิ่ง 60 FPS):** 
  Uses a premium low-pass Exponential Moving Average (EMA) mathematical filter (`alpha = 0.28`) to eliminate high-frequency pixel jitter, producing exceptionally smooth, stable, and natural brush paths with zero delay.  
  *มาพร้อมระบบคำนวณเฉลี่ยเคลื่อนที่แบบถ่วงน้ำหนัก (EMA) กรองการแกว่งและอาการมือสั่นระดับพิกเซลทิ้งจนหมดจด ลายเส้นโค้งมนเนียนเหมือนวาดบนแท็บเล็ตมืออาชีพ โดยตอบสนองรวดเร็วทันใจไร้รอยต่อ!*

* 🗑️ **Gesture Air-Selection & Trash Can (เมนูสั่งการและล้างจออัจฉริยะ):** 
  Point and hover at the Apple-inspired top menu swatches. Watch the circular progress ring load to switch brush colors or select the Trash Can (`🗑️`) to instantly clear your canvas—all without touching your screen or keyboard!  
  *เปลี่ยนสีพู่กันหรือสั่งล้างกระดานได้โดยไม่ต้องสัมผัสอุปกรณ์! เพียงเล็งนิ้วชี้ค้างไว้ที่แถบสีหรือไอคอนถังขยะด้านบน วงแหวนความคืบหน้าจะหมุนโหลดจนเต็มเพื่อทำตามคำสั่งโดยอัตโนมัติ*

* ⚡ **High-Performance Optimization (รีดประสิทธิภาพการประมวลผลสูงสุด):** 
  Specifically calibrated at widescreen WXGA (`ideal 640x360` widescreen capture constraints) to reduce pixel bandwidth by **75%** and optimized to track a single drawing hand (`numHands: 1`), reducing deep-learning workload by **50%** to guarantee a stable, cool-running **60 FPS** experience on ordinary laptops and tablets.  
  *ปรับจูนสตรีมวิดีโอกล้องให้อยู่ที่ความละเอียด Widescreen 360p เพื่อประหยัดพลังงานพิกเซลไปถึง 75% และเจาะจงโฟกัส AI มือหลักเพียงมือเดียว ช่วยประหยัดแบตเตอรี่เครื่องและรันความเร็วเว็บได้เต็มลิมิต 60 FPS ไม่มีอาการสะดุด*

---

## 🛠️ How to Play / วิธีเข้าเล่นใช้งาน

1. Open the [Live Play Link](https://phwarat0212-netizen.github.io/handTrack/) in your browser. *(เปิดลิงก์ด้านบนผ่านเบราว์เซอร์ของคุณ)*
2. Click the central **"Start Drawing"** button and grant webcam permissions to the browser. *(กดปุ่ม "Start Drawing" และกดยอมรับให้เบราว์เซอร์เข้าถึงกล้องเว็บแคม)*
3. **Gesture Commands / คำสั่งท่าทาง:**
   * **Draw (เริ่มวาด):** Raise your hand and point your index finger up (other fingers folded). Moving your pointing finger will draw lines on the canvas. *(ชูนิ้วชี้ขึ้นตรงเพียงนิ้วเดียวเพื่อวาดเขียน เมื่อเคลื่อนนิ้วไปมาจะเป็นการสร้างเส้นสี)*
   * **Stop Drawing (หยุดวาด):** Fold your index finger back or lower your hand. *(พับนิ้วชี้เก็บ หรือลดมือลงเพื่อหยุดการวาดเส้น)*
   * **Select Color / Clear (เลือกสี / ลบภาพ):** Point and hover your finger over the top menu circles or the Trash Can swatch for 1 second. *(ชี้เล็งค้างไว้ที่แถบสีกลมๆ ด้านบน หรือไอคอนถังขยะแช่ไว้ 1 วินาที เพื่อเลือกสีหรือลบกระดาน)*

---

## 🖥️ Technology Stack / เทคโนโลยีที่เลือกใช้

* **Core Structure:** [React 19](https://react.dev/) + [Vite](https://vite.dev/) (For ultra-fast client-side hot-reloading and modular builds)
* **Neural Vision Model:** [Google MediaPipe Tasks Vision (Hand Landmarker)](https://ai.google.dev/edge/mediapipe/solutions/vision/hand_landmarker) (Running WebAssembly and GPU-delegation for real-time inference)
* **Styling System:** Vanilla CSS3 (Custom Apple-inspired dark mode palettes, premium glassmorphism, responsive canvas layers, and smooth micro-animations)
* **Deployment Pipeline:** GitHub Actions CI/CD (Automatically builds and deploys to GitHub Pages upon pushing to `main`)

---

## 👤 Credits

Created by **Warat**  
Powered by Google MediaPipe Vision Tasks.  

*Designed and optimized with 💖 to provide a futuristic, frictionless art creation space.*
