export default function Loading() {
    return (
      <div className="max-w-6xl mx-auto space-y-8 animate-pulse">
        
        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 h-32 relative overflow-hidden">
                   <div className="h-8 w-8 bg-slate-200 rounded-lg mb-4"></div>
                   <div className="h-8 w-16 bg-slate-200 rounded mb-2"></div>
                   <div className="h-4 w-24 bg-slate-100 rounded"></div>
              </div>
          ))}
        </div>
  
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart Skeleton */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 h-96">
              <div className="flex justify-between mb-8">
                  <div className="h-6 w-32 bg-slate-200 rounded"></div>
                  <div className="h-6 w-20 bg-slate-200 rounded"></div>
              </div>
              <div className="flex items-end gap-2 h-64">
                  {[...Array(12)].map((_, i) => (
                      <div key={i} className="w-full bg-slate-100 rounded-t-sm" style={{ height: `${Math.random() * 100}%` }}></div>
                  ))}
              </div>
          </div>
  
          {/* Feed Skeleton */}
          <div className="bg-white rounded-xl border border-slate-200 h-96 p-6 space-y-4">
               <div className="h-6 w-32 bg-slate-200 rounded mb-6"></div>
               {[1, 2, 3, 4, 5].map((i) => (
                   <div key={i} className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-slate-200"></div>
                       <div className="flex-1 space-y-2">
                           <div className="h-4 w-full bg-slate-100 rounded"></div>
                           <div className="h-3 w-1/2 bg-slate-100 rounded"></div>
                       </div>
                   </div>
               ))}
          </div>
        </div>
      </div>
    );
  }