import { useParams } from "react-router";

export default function GemDetail() {
  const { gemId } = useParams();

  return (
    <div>
      <h1>Gem detail: {gemId}</h1>
    </div>
  );
}