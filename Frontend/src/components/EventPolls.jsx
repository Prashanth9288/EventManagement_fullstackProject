import { useState, useEffect } from 'react';
import { io } from "socket.io-client";
import { FaPoll, FaCheckCircle } from 'react-icons/fa';

export default function EventPolls({ eventId, isHost }) {
  const [polls, setPolls] = useState([]);
  const [newPoll, setNewPoll] = useState({ question: "", options: ["", ""] });
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const s = io(window.API_BASE_URL + "");
    setSocket(s);
    s.emit("join", { eventId });

    s.on("poll:new", (poll) => setPolls(prev => [poll, ...prev]));
    s.on("poll:update", (updatedPoll) => {
        setPolls(prev => prev.map(p => p._id === updatedPoll._id ? updatedPoll : p));
    });

    // Initial fetch
    const fetchPolls = async () => {
        try {
            const res = await fetch(`${window.API_BASE_URL}/api/events/${eventId}/polls`);
            const data = await res.json();
            if(res.ok) setPolls(data);
        } catch(err) {
            console.error("Failed to fetch polls", err);
        }
    };
    fetchPolls();

    return () => s.disconnect();
  }, [eventId]);

  const handleCreatePoll = () => {
    if (!newPoll.question || newPoll.options.some(o => !o)) return;
    const pollData = { ...newPoll, eventId, _id: Date.now().toString() /* temp id */, createdAt: new Date() };
    
    // Emit creation
    socket.emit("poll:create", pollData);
    
    // Optimistic
    // setPolls(prev => [pollData, ...prev]);
    setNewPoll({ question: "", options: ["", ""] });
  };

  const handleVote = (pollId, optionIdx) => {
    socket.emit("poll:vote", { pollId, optionIdx, eventId });
  };

  return (
    <div className="bg-white dark:bg-bluewood rounded-2xl shadow-sm border border-gray-200 dark:border-fiord p-6 transition-colors duration-300">
       <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2"><FaPoll className="text-teal-600 dark:text-teal-400"/> Live Polls</h3>
       
       {isHost && (
           <div className="mb-8 p-4 bg-teal-50 dark:bg-teal-900/30 rounded-xl border border-teal-100 dark:border-teal-800">
               <h4 className="font-bold text-teal-900 dark:text-teal-300 mb-2">Create a Poll</h4>
               <input 
                  className="w-full p-2 mb-2 rounded border border-teal-200 dark:border-teal-700 bg-white dark:bg-mirage text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-lynch" 
                  placeholder="Ask a question..."
                  value={newPoll.question}
                  onChange={e => setNewPoll({...newPoll, question: e.target.value})}
               />
               {newPoll.options.map((opt, i) => (
                   <input 
                      key={i}
                      className="w-full p-2 mb-2 rounded border border-teal-200 dark:border-teal-700 bg-white dark:bg-mirage text-gray-900 dark:text-white text-sm placeholder-gray-400 dark:placeholder-lynch"
                      placeholder={`Option ${i+1}`}
                      value={opt}
                      onChange={e => {
                          const newOpts = [...newPoll.options];
                          newOpts[i] = e.target.value;
                          setNewPoll({...newPoll, options: newOpts});
                      }}
                   />
               ))}
               <button onClick={handleCreatePoll} className="w-full py-2 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700">Launch Poll</button>
           </div>
       )}

       <div className="space-y-6">
           {polls.map((poll) => (
               <div key={poll._id} className="border border-gray-100 dark:border-fiord rounded-xl p-4 shadow-sm bg-white dark:bg-bluewood">
                   <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-4">{poll.question}</h4>
                   <div className="space-y-2">
                       {poll.options.map((opt, idx) => {
                           const totalVotes = poll.options.reduce((acc, curr) => acc + (curr.votes || 0), 0);
                           const percent = totalVotes === 0 ? 0 : Math.round(((opt.votes || 0) / totalVotes) * 100);
                           
                           return (
                               <div key={idx} onClick={() => handleVote(poll._id, idx)} className="relative h-10 bg-gray-100 dark:bg-fiord/30 rounded-lg cursor-pointer overflow-hidden group">
                                   <div className="absolute top-0 left-0 h-full bg-teal-200 dark:bg-teal-600 transition-all duration-500" style={{ width: `${percent}%` }}></div>
                                   <div className="absolute inset-0 flex items-center justify-between px-4 z-10">
                                       <span className="font-medium text-gray-700 dark:text-white drop-shadow-sm">{opt.text}</span>
                                       <span className="font-bold text-teal-700 dark:text-teal-200 drop-shadow-sm">{percent}%</span>
                                   </div>
                               </div>
                           );
                       })}
                   </div>
                   <div className="text-right mt-2 text-xs text-gray-400">
                       {poll.options.reduce((acc, curr) => acc + (curr.votes || 0), 0)} votes
                   </div>
               </div>
           ))}
           {polls.length === 0 && <p className="text-gray-400 text-center italic">No active polls.</p>}
       </div>
    </div>
  );
}
