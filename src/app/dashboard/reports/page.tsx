'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, GraduationCap, CheckCircle2, XCircle, Clock, BarChart3, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AIReportsPage() {
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/guardian/students')
      .then(res => res.json())
      .then(data => setStudents(data.students || []));
  }, []);

  const fetchReports = async (studentId: string) => {
    setLoading(true);
    // Aqui buscaríamos a lista de GeneratedLessons do estudante
    const res = await fetch(`/api/guardian/lessons?studentId=${studentId}`);
    const data = await res.json();
    setReports(data.lessons || []);
    setLoading(false);
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white flex items-center gap-3">
            <BarChart3 className="text-blue-600" size={32} />
            Boletim de Inteligência
          </h1>
          <p className="text-slate-500 font-bold mt-1">Acompanhe o aprendizado profundo dos seus filhos.</p>
        </div>

        <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
          {students.map(s => (
            <button
              key={s.id}
              onClick={() => { setSelectedStudent(s.id); fetchReports(s.id); }}
              className={`px-6 py-2.5 rounded-xl font-black text-sm transition-all ${
                selectedStudent === s.id ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {s.username}
            </button>
          ))}
        </div>
      </div>

      {!selectedStudent ? (
        <div className="premium-card p-20 text-center space-y-4 border-dashed">
          <div className="bg-blue-50 dark:bg-blue-900/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-blue-600">
            <GraduationCap size={40} />
          </div>
          <h2 className="text-xl font-black text-slate-800 dark:text-white">Selecione um filho para ver o boletim</h2>
          <p className="text-slate-400 max-w-sm mx-auto">Os dados de desempenho e revisões por IA aparecerão aqui assim que você selecionar um estudante.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {loading ? (
            <div className="flex justify-center p-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div></div>
          ) : reports.length === 0 ? (
             <div className="premium-card p-12 text-center text-slate-400 font-bold">Nenhuma lição realizada ainda.</div>
          ) : (
            reports.map((report) => (
              <ReportCard key={report.id} report={report} studentId={selectedStudent} />
            ))
          )}
        </div>
      )}
    </div>
  );
}

function ReportCard({ report, studentId }: { report: any, studentId: string }) {
  const [details, setDetails] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);

  const fetchDetails = async () => {
    if (details) { setIsOpen(!isOpen); return; }
    const res = await fetch(`/api/guardian/reports/quiz?studentId=${studentId}&topicId=${report.topicId}`);
    const data = await res.json();
    setDetails(data);
    setIsOpen(true);
  };

  return (
    <div className="premium-card overflow-hidden transition-all hover:shadow-xl hover:shadow-blue-500/5">
      <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex gap-4 items-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600">
            <Search size={24} />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-800 dark:text-white">{report.topic.name}</h3>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{report.topic.subject.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-8">
           <div className="text-center">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Data</p>
             <p className="font-black text-slate-600 dark:text-slate-300">{new Date(report.createdAt).toLocaleDateString('pt-BR')}</p>
           </div>
           <button 
            onClick={fetchDetails}
            className="btn-primary py-2.5 px-6 !text-sm"
           >
             {isOpen ? 'Ocultar Detalhes' : 'Ver Desempenho'}
           </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && details && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30"
          >
            <div className="p-8 space-y-8">
              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 text-center">
                  <p className="text-2xl font-black text-blue-600">{details.stats.score}%</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Nota Final</p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 text-center">
                  <p className="text-2xl font-black text-emerald-500">{details.stats.correct}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Acertos</p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 text-center">
                  <p className="text-2xl font-black text-rose-500">{details.stats.total - details.stats.correct}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Erros</p>
                </div>
              </div>

              {/* Question Breakdown */}
              <div className="space-y-4">
                <h4 className="font-black text-slate-800 dark:text-white uppercase tracking-widest text-xs">Análise por Questão</h4>
                {details.report.map((item: any, idx: number) => (
                  <div key={idx} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <p className="font-bold text-slate-700 dark:text-slate-300"><span className="text-slate-400">Q{idx + 1}:</span> {item.question.text}</p>
                      {item.isCorrect ? (
                        <CheckCircle2 className="text-emerald-500 shrink-0" size={24} />
                      ) : (
                        <XCircle className="text-rose-500 shrink-0" size={24} />
                      )}
                    </div>
                    
                    {!item.isCorrect && (
                      <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-sm">
                        <p className="font-black text-rose-800 dark:text-rose-400">Resposta dele(a): {item.question.options.find((o: any) => o.id === item.optionId)?.text}</p>
                        <p className="font-black text-emerald-700 dark:text-emerald-400 mt-1">Resposta Correta: {item.question.options.find((o: any) => o.isCorrect)?.text}</p>
                      </div>
                    )}

                    <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-sm italic text-slate-600 dark:text-slate-400">
                      <span className="font-black text-blue-800 dark:text-blue-400 not-italic block mb-1">Explicação Pedagógica:</span>
                      {item.question.explanation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
