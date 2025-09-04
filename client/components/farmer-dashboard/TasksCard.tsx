import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ListChecks, Clock } from "lucide-react";

function TasksCard() {
  const [tasks, setTasks] = useState<any[]>([
    { id: 1, text: "Check irrigation in field A", due: "Today", done: false },
    { id: 2, text: "Apply compost", due: "2 days", done: false },
  ]);
  const [val, setVal] = useState("");

  const add = () => {
    if (!val.trim()) return;
    setTasks((t) => [...t, { id: Date.now(), text: val.trim(), due: "Soon", done: false }]);
    setVal("");
  };

  const toggle = (id: number) => setTasks((t) => t.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));

  return (
    <Card className="rounded-2xl shadow-sm card-interactive card-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><ListChecks className="w-5 h-5 text-[hsl(var(--primary))]"/> Tasks & Reminders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between bg-[hsl(var(--muted))] p-2 rounded-lg">
              <div>
                <div className={`font-medium ${task.done ? 'line-through text-gray-400' : ''}`}>{task.text}</div>
                <div className="text-xs text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3"/>{task.due}</div>
              </div>
              <button onClick={() => toggle(task.id)} className={`px-3 py-1 rounded-md ${task.done ? 'bg-[hsl(var(--primary))] text-white' : 'bg-white border'}`}>{task.done ? 'Done' : 'Mark'}</button>
            </div>
          ))}

          <div className="flex gap-2">
            <Input value={val} onChange={(e) => setVal(e.target.value)} placeholder="Add task" />
            <Button onClick={add} className="bg-[hsl(var(--primary))]">Add</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default React.memo(TasksCard);
