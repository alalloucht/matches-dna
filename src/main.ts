import "./styles.css";

console.log("DNA Matches started");

const testButton = document.getElementById("testButton");

testButton?.addEventListener("click", async () => {
  await Neutralino.os.showMessageBox(
    "DNA Matches",
    "TypeScript is connected to Neutralinojs!"
  );
});