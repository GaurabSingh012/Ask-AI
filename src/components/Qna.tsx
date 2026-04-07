import { useState, useEffect, useRef } from "react";
import * as qna from "@tensorflow-models/qna";
import "@tensorflow/tfjs";

const Qna = () => {
  const [question, setQuestion] = useState("");
  const [context, setContext] = useState("");
  const [answers, setAnswers] = useState<{ text: string; score: number; confidence?: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModelReady, setIsModelReady] = useState(false);
  const [modelError, setModelError] = useState<string | null>(null);

  const modelRef = useRef<qna.QuestionAndAnswer | null>(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        modelRef.current = await qna.load();
        setIsModelReady(true);
      } catch (err) {
        console.error(err);
        setModelError("Failed to initialize AI model. Your device may lack WebGL support.");
      }
    };
    loadModel();
  }, []);

  const handleAnswer = async () => {
    if (!modelRef.current) return;

    if (!question.trim() || !context.trim()) {
      setError("Context and Question are required.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const results = await modelRef.current.findAnswers(question, context);

      if (results.length === 0) {
        setAnswers([]);
        setError("Could not find a relevant answer in the provided context.");
        setLoading(false);
        return;
      }

      const expScores = results.map((r) => Math.exp(r.score));
      const totalExp = expScores.reduce((a, b) => a + b, 0);

      const processed = results.slice(0, 1).map((ans, i) => ({
        ...ans,
        confidence: ((expScores[i] / totalExp) * 100).toFixed(2),
      }));

      setAnswers(processed);
    } catch (err) {
      setError("Inference failed.");
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 bg-white shadow-xl rounded-2xl space-y-4">
      <h1 className="text-2xl font-bold text-center text-blue-600">
        Question and Answer
      </h1>

      <textarea
        rows={6}
        className="w-full border border-gray-300 rounded-lg p-2"
        placeholder="Enter passage (context)..."
        value={context}
        onChange={(e) => setContext(e.target.value)}
      />

      <input
        type="text"
        className="w-full border border-gray-300 rounded-lg p-2"
        placeholder="Enter your question..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <button
        onClick={handleAnswer}
        disabled={!isModelReady || loading}
        className={`w-full py-2 rounded-lg text-white transition ${
          !isModelReady || loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {!isModelReady
          ? "Downloading AI Model (45MB)..."
          : loading
          ? "Analyzing text..."
          : "Get Answers"}
      </button>

      {modelError && (
        <div className="text-red-600 font-semibold mt-2 text-center bg-red-50 p-2 rounded-md border border-red-200">
          {modelError}
        </div>
      )}

      {error && (
        <div className="text-red-600 font-semibold mt-2 text-center bg-red-50 p-2 rounded-md border border-red-200">
          {error}
        </div>
      )}

      {answers.length > 0 && (
        <div className="mt-4 space-y-2">
          {answers.map((ans, index) => (
            <div key={index} className="p-3 border rounded-md bg-gray-50">
              <p className="text-gray-800">
                <strong>Answer:</strong> {ans.text}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Confidence:</strong> {ans.confidence}%
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Qna;