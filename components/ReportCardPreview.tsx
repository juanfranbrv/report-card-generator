
import React, { forwardRef } from 'react';
import { ReportData } from '../types';

interface Props {
  data: ReportData;
  isInfantil?: boolean;
}

const ReportCardPreview = forwardRef<HTMLDivElement, Props>(({ data, isInfantil = false }, ref) => {
  return (
    <div
      ref={ref}
      id="report-card-capture"
      className="bg-white w-[210mm] min-h-[297mm] p-[12mm] shadow-2xl relative worksheet-font text-black border-[1px] border-gray-100"
      style={{ boxSizing: 'border-box' }}
    >
      {/* Header / Logo Section */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 pt-2">
          <h1 className="title-font text-5xl text-gray-600 tracking-tight text-center lg:text-left drop-shadow-md">
            Student Report Card
          </h1>
        </div>
        <div className="w-40 text-right">
          <img src={`${import.meta.env.BASE_URL}logoweb1.png`} alt="Bauset Centro de Estudios" className="w-full h-auto" />
        </div>
      </div>

      {/* Basic Info Fields */}
      <div className="bg-gray-400 p-4 rounded-xl space-y-3 mb-6 border-2 border-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
        <div className="flex items-center gap-3">
          <span className="font-bold text-lg min-w-[120px]">Student's name</span>
          <div className="flex-1 h-8 bg-white border-2 border-gray-800 rounded-full px-4 flex items-center font-bold text-xl leading-none pt-0">
            <span className="-mt-1">{data.studentName}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-bold text-lg min-w-[120px]">Teacher's name</span>
          <div className="flex-1 h-8 bg-white border-2 border-gray-800 rounded-full px-4 flex items-center font-bold text-xl leading-none pt-0">
            <span className="-mt-1">{data.teacherName}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-bold text-lg min-w-[120px]">Course/Level</span>
          <div className="flex-1 h-8 bg-white border-2 border-gray-800 rounded-full px-4 flex items-center font-bold text-xl leading-none pt-0">
            <span className="-mt-1">{data.courseLevel}</span>
          </div>
          <span className="font-bold text-lg ml-2">Year</span>
          <div className="w-40 h-8 bg-white border-2 border-gray-800 rounded-full px-4 flex items-center justify-center font-bold text-lg leading-none pt-0 overflow-hidden whitespace-nowrap">
            <span className="-mt-1">{data.year}</span>
          </div>
        </div>
      </div>

      {/* Grades and Grading System Section */}
      <div className="flex gap-6 mb-6">
        {/* Grades Table */}
        <div className="flex-1">
          <h2 className="title-font text-3xl text-center mb-2">Grades</h2>
          <div className="bg-gray-400 border-[3px] border-gray-800 rounded-lg overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
            <div className="grid grid-cols-2">
              <div className="border-r-[3px] border-b-[3px] border-gray-800 p-3 font-bold text-xl">Reading</div>
              <div className="border-b-[3px] border-gray-800 p-2 bg-gray-400">
                <div className="bg-white border-2 border-gray-800 rounded-full h-8 px-4 flex items-center justify-center font-bold text-xl leading-none pt-0">
                  <span className="-mt-1">{data.grades.reading}</span>
                </div>
              </div>
              <div className="border-r-[3px] border-b-[3px] border-gray-800 p-3 font-bold text-xl">Writing</div>
              <div className="border-b-[3px] border-gray-800 p-2 bg-gray-400">
                <div className="bg-white border-2 border-gray-800 rounded-full h-8 px-4 flex items-center justify-center font-bold text-xl leading-none pt-0">
                  <span className="-mt-1">{data.grades.writing}</span>
                </div>
              </div>
              {!isInfantil && (
                <>
                  <div className="border-r-[3px] border-b-[3px] border-gray-800 p-3 font-bold text-xl">Listening</div>
                  <div className="border-b-[3px] border-gray-800 p-2 bg-gray-400">
                    <div className="bg-white border-2 border-gray-800 rounded-full h-8 px-4 flex items-center justify-center font-bold text-xl leading-none pt-0">
                      <span className="-mt-1">{data.grades.listening}</span>
                    </div>
                  </div>
                  <div className="border-r-[3px] border-gray-800 p-3 font-bold text-xl">Speaking</div>
                  <div className="p-2 bg-gray-400">
                    <div className="bg-white border-2 border-gray-800 rounded-full h-8 px-4 flex items-center justify-center font-bold text-xl leading-none pt-0">
                      <span className="-mt-1">{data.grades.speaking}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Grading System Sticky Note */}
        <div className="w-48 relative mt-10">
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-5 bg-gray-300 border border-gray-800/20 z-10 rotate-1 shadow-sm"></div>
          <div className="bg-white border-[3px] border-gray-800 p-4 shadow-[5px_5px_0px_0px_rgba(0,0,0,0.1)] relative mt-2 rounded-sm">
            <h3 className="font-bold text-center underline mb-2 text-sm leading-none">Grading System</h3>
            <ul className="text-lg font-bold leading-tight">
              <li className="flex justify-between"><span>A</span> <span>90-100</span></li>
              <li className="flex justify-between"><span>B</span> <span>80-89</span></li>
              <li className="flex justify-between"><span>C</span> <span>70-79</span></li>
              <li className="flex justify-between"><span>D</span> <span>60-69</span></li>
              <li className="flex justify-between"><span>E</span> <span>0-59</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Behavior Matrix */}
      <div className="mb-6 border-[3px] border-gray-800 rounded-lg overflow-hidden bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
        <table className="w-full border-collapse">
          <tbody>
            {(['participation', 'learningBehaviors', 'socialSkills', 'classWork'] as const).map((cat, idx) => (
              <tr key={cat} className={idx !== 3 ? 'border-b-[3px] border-gray-800' : ''}>
                <td className="w-2/3 p-3 font-bold text-xl border-r-[3px] border-gray-800 capitalize bg-white leading-none">
                  {cat.replace(/([A-Z])/g, ' $1').trim()}
                </td>
                <td className="p-2 bg-white">
                  <div className="flex justify-around items-center">
                    <span className={`text-4xl filter transition-all ${data.behaviors[cat] === 'happy' ? 'scale-125' : 'grayscale opacity-20'}`}>😊</span>
                    <span className={`text-4xl filter transition-all ${data.behaviors[cat] === 'neutral' ? 'scale-125' : 'grayscale opacity-20'}`}>😐</span>
                    <span className={`text-4xl filter transition-all ${data.behaviors[cat] === 'sad' ? 'scale-125' : 'grayscale opacity-20'}`}>☹️</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Comments Section */}
      <div className="relative">
        <h2 className="title-font text-3xl text-center mb-2">Comments</h2>

        {/* Notebook Spiral Decoration */}
        <div className="flex justify-around px-6 -mb-3 z-10 relative">
          {[...Array(22)].map((_, i) => (
            <div key={i} className="w-2 h-4 bg-gray-400 border border-gray-800 rounded-full shadow-sm"></div>
          ))}
        </div>

        <div className="bg-white border-[3px] border-gray-800 p-6 pt-10 min-h-[200px] rounded-lg relative overflow-hidden">
          {/* Lined paper effect */}
          <div className="absolute inset-0 pointer-events-none opacity-10">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-8 border-b border-gray-800 w-full mt-1"></div>
            ))}
          </div>
          <p className="relative text-xl leading-relaxed font-bold text-gray-800">
            {data.comments}
          </p>
        </div>
      </div>

      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="absolute h-full w-[1px] bg-black left-1/2"></div>
        <div className="absolute w-full h-[1px] bg-black top-1/4"></div>
        <div className="absolute w-full h-[1px] bg-black top-2/4"></div>
        <div className="absolute w-full h-[1px] bg-black top-3/4"></div>
      </div>
    </div>
  );
});

ReportCardPreview.displayName = 'ReportCardPreview';

export default ReportCardPreview;
