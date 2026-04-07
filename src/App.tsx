import Qna from "./components/Qna";

const App = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <header className="bg-blue-600 text-white py-4 shadow-md">
        <div className="max-w-5xl mx-auto px-4 flex flex-wrap justify-between items-center gap-3">
          <h1 className="text-lg md:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent drop-shadow-sm">
            Ask AI
          </h1>
          <span className="text-xs md:text-sm font-semibold bg-blue-800 px-3 py-1 rounded-full shadow-inner whitespace-nowrap">
            Powered by MobileBERT
          </span>
        </div>
      </header>

      <main className="flex-grow w-full max-w-5xl mx-auto p-4 sm:p-6 md:p-8 flex flex-col">
        <Qna />
      </main>

      <footer className="bg-slate-800 text-slate-300 py-6 text-center shadow-inner mt-auto">
        <div className="max-w-5xl mx-auto px-4 flex flex-col items-center justify-center">
          <p className="text-sm md:text-base font-medium">
            Made with <span className="text-red-500 animate-pulse">❤️</span> by
            Gaurab
          </p>
          <p className="text-xs mt-2 opacity-50">
            &copy; {new Date().getFullYear()} All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
