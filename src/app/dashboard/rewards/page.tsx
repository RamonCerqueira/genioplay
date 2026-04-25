import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Gift, Coins, CheckCircle2, Clock, Sparkles, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default async function RewardsPage() {
  const session = await getSession();

  const student = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      wallet: true,
      studentIn: {
        include: {
          guardian: {
            include: {
              rewards: {
                where: { isActive: true }
              }
            }
          }
        }
      }
    }
  });

  if (!student) return null;

  // Pegar recompensas cadastradas pelo responsável
  const rewards = student.studentIn.flatMap(s => s.guardian.rewards);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
          <ShoppingBag className="text-blue-600" size={32} />
          Lojinha de Prêmios
        </h1>
        <p className="text-slate-500 font-bold">Troque suas moedas por recompensas incríveis!</p>
      </div>

      {/* Balance Card */}
      <div className="premium-card p-6 bg-gradient-to-r from-blue-600 to-indigo-600 border-none text-white flex items-center justify-between shadow-blue-500/30">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
            <Coins size={28} className="text-yellow-300 fill-yellow-300" />
          </div>
          <div>
            <p className="text-blue-100 text-xs font-black uppercase tracking-widest">Seu Saldo Atual</p>
            <p className="text-3xl font-black">{student.wallet?.balance || 0} Moedas</p>
          </div>
        </div>
        <Sparkles className="text-blue-300 opacity-50 animate-pulse" size={40} />
      </div>

      {/* Rewards Grid */}
      <div className="grid gap-6 sm:grid-cols-2">
        {rewards.length > 0 ? rewards.map((reward) => {
          const canAfford = (student.wallet?.balance || 0) >= reward.cost;
          
          return (
            <div key={reward.id} className="premium-card p-6 flex flex-col gap-5 border-slate-100 hover:border-blue-300 hover:shadow-2xl transition-all group">
              <div className="flex justify-between items-start">
                <div className={`p-4 rounded-[2rem] transition-all duration-500 ${
                  canAfford ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white' : 'bg-slate-50 text-slate-400'
                }`}>
                  <Gift size={32} />
                </div>
                <div className="bg-orange-50 px-4 py-2 rounded-2xl border border-orange-100 flex items-center gap-2">
                  <Coins size={16} className="text-orange-500 fill-orange-500" />
                  <span className="text-lg font-black text-orange-600">{reward.cost}</span>
                </div>
              </div>
              
              <div>
                <h3 className="font-black text-xl text-slate-800">{reward.title}</h3>
                <p className="text-sm text-slate-500 font-medium mt-2 line-clamp-2">
                  {reward.description || 'Uma recompensa especial preparada para você!'}
                </p>
              </div>

              <button 
                disabled={!canAfford}
                className={`w-full py-4 rounded-2xl font-black text-base transition-all duration-300 ${
                  canAfford 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 active:scale-95' 
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                }`}
              >
                {canAfford ? 'Resgatar Recompensa' : 'Saldo Insuficiente'}
              </button>
            </div>
          );
        }) : (
          <div className="col-span-full premium-card p-16 text-center border-dashed border-slate-200 bg-slate-50/50">
            <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
               <Gift size={40} className="text-slate-300" />
            </div>
            <h3 className="text-xl font-black text-slate-800">Nenhum prêmio ainda?</h3>
            <p className="text-slate-500 font-bold mt-2 max-w-xs mx-auto">
              Peça ao seu responsável para cadastrar recompensas incríveis na área dos pais!
            </p>
          </div>
        )}
      </div>

      {/* History Section */}
      <div className="space-y-5">
        <h2 className="text-xl font-black text-slate-800 flex items-center gap-3">
          <div className="bg-slate-100 p-2 rounded-xl text-slate-600">
            <Clock size={20} />
          </div>
          Seus Pedidos
        </h2>
        <div className="premium-card p-10 border-slate-100 bg-slate-50/30 text-center">
          <p className="text-slate-400 font-bold italic">Você ainda não resgatou prêmios. Comece a focar para conquistar o seu primeiro!</p>
        </div>
      </div>
    </div>
  );
}
