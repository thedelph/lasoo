import { useState, useEffect } from "react";
import { useProfile } from "../../../hooks/useProfile";
import { toast } from "sonner";

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
  const { loading } = useProfile();
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

  if (loading) {
    return <span className="loading loading-spinner loading-lg"></span>;
  }

  return (
    <div className="space-y-6">
      {DAYS.map((day) => (
        <div key={day} className="flex items-center gap-4">
          <span className="w-24 capitalize">{day}</span>
          
          <select
            className="select select-bordered flex-1"
            value={workingHours[day]?.start_time || 'Closed'}
            onChange={(e) => handleHoursChange(day, 'start_time', e.target.value)}
            disabled={saving}
          >
            {TIME_SLOTS.map((time) => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>

          <span>to</span>

          <select
            className="select select-bordered flex-1"
            value={workingHours[day]?.end_time || 'Closed'}
            onChange={(e) => handleHoursChange(day, 'end_time', e.target.value)}
            disabled={workingHours[day]?.start_time === 'Closed' || saving}
          >
            {TIME_SLOTS.map((time) => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}