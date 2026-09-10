import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toPng } from "html-to-image";
import { api } from "../api/client";
import KTPCard from "../components/KTPCard";

export default function KTP() {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [error, setError] = useState("");
  const ktpRef = useRef(null);

  useEffect(() => {
    api
      .getKtp(id)
      .then((res) => setMember(res.data))
      .catch((err) => setError(err.message));
  }, [id]);

  async function handleDownload() {
    if (!ktpRef.current || !member) return;
    const dataUrl = await toPng(ktpRef.current, { pixelRatio: 2 });
    const link = document.createElement("a");
    link.download = `KTP-${member.idAnggota}.png`;
    link.href = dataUrl;
    link.click();
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-14">
      <h1 className="font-serif text-2xl font-bold text-rni-green text-center mb-8">
        KTP Digital RNI
      </h1>

      {error && <p className="text-center text-red-600 text-sm">{error}</p>}

      {member && (
        <>
          <KTPCard ref={ktpRef} member={member} />
          <div className="flex justify-center mt-6">
            <button
              onClick={handleDownload}
              className="px-6 py-3 rounded-lg bg-rni-gold text-rni-green font-semibold hover:bg-rni-gold-light transition-colors"
            >
              Download KTP
            </button>
          </div>
        </>
      )}
    </div>
  );
}
