import { useState } from "react";

export default function ImageTest() {
  const [status, setStatus] = useState("loading...");

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Image Loading Test</h1>
      <p className="mb-4">Status: {status}</p>
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Rudbeckia_fulgida.JPG/500px-Rudbeckia_fulgida.JPG"
        alt="Black-Eyed Susan test"
        className="w-64 h-48 object-cover rounded-lg border"
        onLoad={() => setStatus("IMAGE LOADED SUCCESSFULLY")}
        onError={() => setStatus("IMAGE BLOCKED BY SANDBOX")}
      />
    </div>
  );
}
