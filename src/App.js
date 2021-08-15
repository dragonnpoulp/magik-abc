import { useEffect, useRef, useState } from "react";
import "./App.css";
import getIndexDb from "./db";

let recorder = null;
async function getRecorder() {
  if (!recorder) {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    recorder = new MediaRecorder(stream);
  }

  return recorder;
}

function App() {
  const [recording, setRecording] = useState("");
  const [point, setPoint] = useState(0);
  const ref = useRef("");
  const field = window.location.search === "?admin=true" ? "admin" : "member";

  useEffect(() => {
    (async () => {
      await getRecorder();

      let chunks = [];
      const audio = document.createElement("audio");
      const adminAudio = document.createElement("audio");

      recorder.onstop = async () => {
        var blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
        chunks = [];
        const base64 = Buffer.from(await blob.arrayBuffer()).toString("base64");
        const audioURL = `data:audio/ogg;base64,${base64}`;
        audio.src = audioURL;
        await audio.play();

        const db = await getIndexDb();
        const obj = (await db.get("audio", ref.current)) || {};

        if (field === "admin") {
          const db = await getIndexDb();
          const obj = (await db.get("audio", ref.current)) || {};
          Object.assign(obj, { [field]: audioURL });
          await db.put("audio", obj, ref.current);
        } else if (obj.admin) {
          audio.onended = () => {
            adminAudio.src = obj.admin;
            adminAudio.play();
          };
        }
      };

      recorder.ondataavailable = function (e) {
        chunks.push(e.data);
      };
    })();

    return () => {};
  }, [field]);

  let stars = [];
  for (let i = 0; i < point; i++) {
    stars.push(true);
  }
  return (
    <div className="cards">
      {[
        "a",
        "ă",
        "â",
        "b",
        "c",
        "d",
        "đ",
        "e",
        "ê",
        "g",
        "h",
        "i",
        "k",
        "l",
        "m",
        "n",
        "o",
        "ô",
        "ơ",
        "p",
        "q",
        "r",
        "s",
        "t",
        "u",
        "ư",
        "v",
        "x",
        "y",
      ].map((content) => (
        <div
          key={content}
          className={`card ${recording === content && "recoding"}`}
          onClick={async () => {
            if (!recording && recorder.state === "inactive") {
              setTimeout(() => {
                setRecording(content);
                ref.current = content;
                recorder.start();
              }, 200);

              setTimeout(() => {
                setRecording("");
                recorder.stop();
              }, 2000);
            } else {
            }
          }}
        >
          {content}
        </div>
      ))}
      <div className="point" onClick={() => setPoint(point + 1)}>
        {point === 0 && "No stars"}
        {stars.map(() => (
          <img src="https://cdn.shopify.com/s/files/1/0072/7901/8045/products/w200402_star_eraser.jpg?v=1594388127" />
        ))}
      </div>
    </div>
  );
}

export default App;
