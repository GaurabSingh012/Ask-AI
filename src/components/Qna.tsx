import React, { useState } from "react";
import * as qna from "@tensorflow-models/qna";
import "@tensorflow/tfjs";

const Qna = () => {
  const [question, setQuestion] = useState("");
  const [context, setContext] = useState("");
  const [answers, setAnswers] = useState<{ text: string; score: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnswer = async () => {
    if (!question.trim() || !context.trim()) {
      setError("Please enter both context and question.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const model = await qna.load();
      const results = await model.findAnswers(question, context);
      console.log("Model results:", results);
      setAnswers(results.slice(0, 2));
    } catch (err) {
      setError("Failed to get answers. Please try again.");
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
        disabled={loading}
        className={`w-full py-2 rounded-lg text-white transition ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {loading ? "Thinking..." : "Get Answers"}
      </button>

      {error && (
        <div className="text-red-600 font-semibold mt-2 text-center">{error}</div>
      )}

      {answers.length > 0 && (
        <div className="mt-4 space-y-2">
          <h2 className="text-lg font-semibold mb-2">Answers:</h2>
          {answers.map((ans, index) => (
            <div key={index} className="p-3 border rounded-md bg-gray-50">
              <p className="text-gray-800">
                <strong>Answer:</strong> {ans.text}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Confidence:</strong> {(ans.score * 100).toFixed(2)}%
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Qna;
