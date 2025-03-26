'use client';

import { useState, useEffect } from 'react';
import { useProfile } from '@/hooks/useProfile';
import {
  getWorkingHours,
  updateWorkingHours,
} from '@/lib/supabase/working-hours';
import { toast } from 'sonner';

const DAYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];
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
  '21:00',
];

export default function WorkingHoursTab() {
  const { profile, loading: profileLoading } = useProfile();
  const [workingHours, setWorkingHours] = useState<
    Record<
      string,
      { start_time: string | null; end_time: string | null; is_closed: boolean }
    >
  >({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadWorkingHours() {
      if (!profile?.id) return;

      try {
        const hours = await getWorkingHours(profile.id);
        const hoursMap = hours.reduce(
          (acc, hour) => ({
            ...acc,
            [hour.day]: {
              start_time: hour.start_time,
              end_time: hour.end_time,
              is_closed: hour.is_closed,
            },
          }),
          {}
        );
        setWorkingHours(hoursMap);
      } catch (error) {
        toast.error('Failed to load working hours');
      } finally {
        setLoading(false);
      }
    }

    if (profile?.id) {
      loadWorkingHours();
    }
  }, [profile?.id]);

  const handleHoursChange = async (
    day: string,
    field: 'start_time' | 'end_time',
    value: string
  ) => {
    if (!profile?.id) return;

    const isClosed = value === 'Closed';
    const newHours = {
      ...workingHours[day],
      [field]: isClosed ? null : value,
      is_closed:
        isClosed && field === 'start_time' ? true : workingHours[day].is_closed,
    };

    setWorkingHours((prev) => ({
      ...prev,
      [day]: newHours,
    }));

    try {
      await updateWorkingHours(profile.id, day, newHours);
    } catch (error) {
      toast.error(`Failed to update ${day}'s hours`);
    }
  };

  if (loading || profileLoading) {
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
            onChange={(e) =>
              handleHoursChange(day, 'start_time', e.target.value)
            }
          >
            {TIME_SLOTS.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>

          <span>to</span>

          <select
            className="select select-bordered flex-1"
            value={workingHours[day]?.end_time || 'Closed'}
            onChange={(e) => handleHoursChange(day, 'end_time', e.target.value)}
            disabled={workingHours[day]?.start_time === 'Closed'}
          >
            {TIME_SLOTS.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}
