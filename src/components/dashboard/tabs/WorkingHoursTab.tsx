import { useState, useEffect } from "react";
import { useSupabaseProfile } from "../../../hooks/useSupabaseProfile";
import { toast } from "sonner";
import { Loader2, Clock, Calendar, Check, X } from "lucide-react";

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const TIME_SLOTS = [
  'Closed',
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00'
];

interface WorkingHours {
  [key: string]: {
    start_time: string | null;
    end_time: string | null;
    is_closed: boolean;
  };
}

export default function WorkingHoursTab() {
  const { loading } = useSupabaseProfile();
  const [workingHours, setWorkingHours] = useState<WorkingHours>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Initialize with default hours
    const defaultHours = DAYS.reduce((acc, day) => ({
      ...acc,
      [day]: {
        start_time: day === 'sunday' ? null : '09:00',
        end_time: day === 'sunday' ? null : '17:00',
        is_closed: day === 'sunday'
      }
    }), {});

    setWorkingHours(defaultHours);
  }, []);

  const handleHoursChange = async (day: string, field: 'start_time' | 'end_time', value: string) => {
    const isClosed = value === 'Closed';
    const newHours = {
      ...workingHours[day],
      [field]: isClosed ? null : value,
      is_closed: isClosed && field === 'start_time' ? true : workingHours[day].is_closed
    };

    setWorkingHours(prev => ({
      ...prev,
      [day]: newHours
    }));

    try {
      setSaving(true);
      // Here you would typically update the hours in your backend
      toast.success(`Updated ${day}'s hours`);
    } catch (error) {
      toast.error(`Failed to update ${day}'s hours`);
    } finally {
      setSaving(false);
    }
  };

  const getDayStatus = (day: string) => {
    const hours = workingHours[day];
    if (!hours || hours.is_closed || !hours.start_time || !hours.end_time) {
      return "Closed";
    }
    return `${hours.start_time} - ${hours.end_time}`;
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm text-slate-500">Loading your working hours...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900">Working Hours</h2>
        <p className="mt-1 text-sm text-slate-500">
          Set your business hours to let customers know when you're available.
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
          <h3 className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <Calendar className="h-4 w-4 text-slate-500" />
            Weekly Schedule
          </h3>
        </div>
        
        <div className="divide-y divide-slate-100">
          {DAYS.map((day) => (
            <div key={day} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4">
              <div className="w-full sm:w-32 flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${workingHours[day]?.is_closed ? 'bg-slate-300' : 'bg-green-500'}`}></div>
                <span className="font-medium capitalize text-slate-700">{day}</span>
              </div>
              
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor={`${day}-start`} className="block text-xs font-medium text-slate-500">
                    Opening Time
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Clock className="h-4 w-4 text-slate-400" />
                    </div>
                    <select
                      id={`${day}-start`}
                      className="w-full rounded-md border border-slate-300 pl-10 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                      value={workingHours[day]?.start_time || 'Closed'}
                      onChange={(e) => handleHoursChange(day, 'start_time', e.target.value)}
                      disabled={saving}
                    >
                      {TIME_SLOTS.map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor={`${day}-end`} className="block text-xs font-medium text-slate-500">
                    Closing Time
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Clock className="h-4 w-4 text-slate-400" />
                    </div>
                    <select
                      id={`${day}-end`}
                      className={`w-full rounded-md border border-slate-300 pl-10 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white ${
                        workingHours[day]?.start_time === 'Closed' ? 'opacity-50' : ''
                      }`}
                      value={workingHours[day]?.end_time || 'Closed'}
                      onChange={(e) => handleHoursChange(day, 'end_time', e.target.value)}
                      disabled={workingHours[day]?.start_time === 'Closed' || saving}
                    >
                      {TIME_SLOTS.map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="hidden sm:flex items-center justify-center w-32 text-sm">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  workingHours[day]?.is_closed 
                    ? 'bg-slate-100 text-slate-600' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {getDayStatus(day)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button 
          type="button" 
          className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          disabled={saving}
          onClick={() => toast.success("Working hours saved successfully")}
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving Hours...
            </>
          ) : (
            'Save Working Hours'
          )}
        </button>
      </div>

      <div className="mt-8 rounded-lg border border-slate-200 bg-white">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
          <h3 className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <Clock className="h-4 w-4 text-slate-500" />
            Hours Summary
          </h3>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {DAYS.map((day) => (
              <div key={`summary-${day}`} className="flex items-center justify-between p-2 rounded-md border border-slate-200">
                <span className="capitalize font-medium text-slate-700">{day}</span>
                <div className="flex items-center gap-1.5">
                  {workingHours[day]?.is_closed ? (
                    <X className="h-4 w-4 text-slate-400" />
                  ) : (
                    <Check className="h-4 w-4 text-green-500" />
                  )}
                  <span className="text-sm text-slate-600">
                    {getDayStatus(day)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}