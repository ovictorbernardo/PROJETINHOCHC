// src/components/common/Calendar/Calendar.jsx — VERSÃO INTEGRADA + VISUAL MINIMALISTA
import React from 'react';
import DayCard from './DayCard';

const Calendar = ({ mesAno, onDayClick, selectedDay, isAdmin = false }) => {
  if (!mesAno) return null;

  // 🎯 GERADOR DE DIAS COMPATÍVEL COM SEU DAYCARD
  const generateCalendarDays = () => {
    const [ano, mes] = mesAno.split('-').map(Number);
    const firstDay = new Date(ano, mes - 1, 1);
    const lastDay = new Date(ano, mes, 0);
    const firstDayOfWeek = firstDay.getDay();
    const adjustedFirstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

    const days = [];
    for (let i = 0; i < adjustedFirstDayOfWeek; i++) days.push(null);

    const totalDays = lastDay.getDate();
    for (let dia = 1; dia <= totalDays; dia++) {
      const data = new Date(ano, mes - 1, dia);
      const ehDomingo = data.getDay() === 0;
      const ehPassado = data < new Date();

      days.push({
        dia,
        numero: dia,
        disponivel: true,
        status: 'indisponivel',
        ehDomingo,
        ehPassado,
        data: data.toISOString()
      });
    }
    return days;
  };

  const days = generateCalendarDays();
  const weekDays = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
  const [ano, mes] = mesAno.split('-').map(Number);
  const nomeMes = new Date(ano, mes - 1).toLocaleString('pt-BR', { month: 'long' });

  // 🎯 FUNÇÃO PARA VERIFICAR SE É HOJE
  const isToday = (dia) => {
    const today = new Date();
    return (
      dia.dia === today.getDate() &&
      mes === today.getMonth() + 1 &&
      ano === today.getFullYear()
    );
  };

  // 🎯 CONTROLES DE MÊS
  const handlePreviousMonth = () => {
    const prev = new Date(ano, mes - 2, 1);
    const formatted = `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}`;
    onDayClick && onDayClick({ tipo: 'change-month', mesAno: formatted });
  };

  const handleNextMonth = () => {
    const next = new Date(ano, mes, 1);
    const formatted = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}`;
    onDayClick && onDayClick({ tipo: 'change-month', mesAno: formatted });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      {/* 🎯 CABEÇALHO MINIMALISTA */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 capitalize">
            {nomeMes} de {ano}
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Selecione um dia disponível para agendar sua visita
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handlePreviousMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            aria-label="Mês anterior"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            aria-label="Próximo mês"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* 🎯 DIAS DA SEMANA */}
      <div className="grid grid-cols-7 gap-3 mb-4">
        {weekDays.map((dia) => (
          <div
            key={dia}
            className="text-center text-sm font-medium text-gray-500 py-2 uppercase tracking-wide"
          >
            {dia}
          </div>
        ))}
      </div>

      {/* 🎯 GRADE DE DIAS */}
      <div className="grid grid-cols-7 gap-3">
        {days.map((dayInfo, index) =>
          dayInfo ? (
            <DayCard
              key={`day-${dayInfo.dia}`}
              dayInfo={{ ...dayInfo, isToday: isToday(dayInfo) }}
              isSelected={selectedDay?.dia === dayInfo.dia}
              isAdmin={isAdmin}
              onDayClick={onDayClick}
            />
          ) : (
            <div key={`empty-${index}`} className="h-24" />
          )
        )}
      </div>

      {/* 🎯 LEGENDA MINIMALISTA */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex flex-wrap gap-6 justify-center">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Disponível</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Lotado</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <span className="text-sm text-gray-600">Fechado</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Indisponível</span>
          </div>
        </div>
      </div>

      {/* 🎯 INFORMAÇÕES IMPORTANTES */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-2">Informações Importantes</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Dias em verde estão disponíveis para agendamento</li>
          <li>• Dias em vermelho estão indisponíveis ou lotados</li>
          <li>• Domingos e feriados estão fechados</li>
          <li>• Horários disponíveis: 10:00, 14:00 e 16:00</li>
        </ul>
      </div>
    </div>
  );
};

export default Calendar;
