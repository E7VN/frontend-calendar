"use client";

import { useRecurrence } from "../../contexts/RecurrenceContext";
import { generateRecurrenceDates } from "../../components/recurring-date-picker/GenerateRecurrence";
import { useState } from "react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

const frequencies = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

export default function RecurringDatePicker() {
  const { recurrence, setRecurrence } = useRecurrence();
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const previewDates = generateRecurrenceDates(recurrence, 10);

  return (
    <div className="p-4 bg-white rounded shadow max-w-md">
      {/* Frequency Selector */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">Frequency:</label>
        <select
          className="border rounded px-2 py-1"
          value={recurrence.frequency}
          onChange={e => setRecurrence({ ...recurrence, frequency: e.target.value })}
        >
          {frequencies.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Interval Input */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">
          Every
          <input
            type="number"
            min={1}
            value={recurrence.interval}
            onChange={e => setRecurrence({ ...recurrence, interval: Number(e.target.value) })}
            className="w-16 border rounded px-2 py-1 mx-2"
          />
          {/* Dynamic singular/plural label */}
          {(() => {
            const freqLabels = {
              daily: ["Day", "Days"],
              weekly: ["Week", "Weeks"],
              monthly: ["Month", "Months"],
              yearly: ["Year", "Years"],
            };
            const curr = freqLabels[recurrence.frequency] || ["", ""];
            return (recurrence.interval || 1) === 1 ? curr[0] : curr[1];
          })()}
        </label>
      </div>

      {/* Day of Week Selector (for Weekly only) */}
      {recurrence.frequency === "weekly" && (
        <div className="mb-4">
          <label className="inline-flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              className="accent-blue-600"
              checked={recurrence.useMultipleWeekdays || false}
              onChange={e => setRecurrence({
                ...recurrence,
                useMultipleWeekdays: e.target.checked,
                // Reset to just the weekday of start when turning off:
                daysOfWeek: e.target.checked
                  ? (recurrence.daysOfWeek || [])
                  : [["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][new Date(recurrence.startDate).getDay()]],
              })}
            />
            Repeat on specific weekdays
          </label>

          {recurrence.useMultipleWeekdays && (
            <div className="flex gap-2 mt-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                <label key={day} className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={recurrence.daysOfWeek?.includes(day)}
                    onChange={e => {
                      if (e.target.checked) {
                        setRecurrence({
                          ...recurrence,
                          daysOfWeek: [...(recurrence.daysOfWeek || []), day],
                        });
                      } else {
                        setRecurrence({
                          ...recurrence,
                          daysOfWeek: (recurrence.daysOfWeek || []).filter(d => d !== day),
                        });
                      }
                    }}
                    className="mr-1"
                  />
                  {day}
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {recurrence.frequency === "monthly" && (
      <div className="mb-4">
        {/* Toggle: Use pattern (e.g., Second Tuesday) */}
        <label className="inline-flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            className="accent-blue-600"
            checked={recurrence.usePattern || false}
            onChange={e =>
              setRecurrence({
                ...recurrence,
                usePattern: e.target.checked,
              })
            }
          />
          Use pattern (e.g. “Second Tuesday”)
        </label>

        {/* Show dropdowns only if 'Use pattern' is selected */}
        {recurrence.usePattern && (
          <div className="mt-2 flex gap-4">
            <div>
              <label className="block font-semibold mb-1">Which:</label>
              <select
                className="border rounded px-2 py-1"
                value={recurrence.monthlyOcc || "Second"}
                onChange={e =>
                  setRecurrence({
                    ...recurrence,
                    monthlyOcc: e.target.value,
                  })
                }
              >
                <option value="First">First</option>
                <option value="Second">Second</option>
                <option value="Third">Third</option>
                <option value="Fourth">Fourth</option>
                <option value="Last">Last</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Weekday:</label>
              <select
                className="border rounded px-2 py-1"
                value={recurrence.monthlyDay || "Tuesday"}
                onChange={e =>
                  setRecurrence({
                    ...recurrence,
                    monthlyDay: e.target.value,
                  })
                }
              >
                <option value="Sunday">Sunday</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
              </select>
            </div>
          </div>
        )}
      </div>
    )}



      {/* Start Date Picker */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">Start Date:</label>
        <button
          onClick={() => setShowStartPicker(v => !v)}
          className="border px-3 py-2 rounded bg-gray-50"
        >
          {recurrence.startDate
            ? format(recurrence.startDate, "yyyy-MM-dd")
            : "Pick a start date"}
        </button>
        {showStartPicker && (
          <div>
            <DayPicker
              mode="single"
              selected={recurrence.startDate}
              onSelect={date => {
                setRecurrence({ ...recurrence, startDate: date });
                setShowStartPicker(false);
              }}
            />
          </div>
        )}
      </div>

      {/* End Date Picker */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">
          End Date: <span className="font-normal text-gray-500">(Optional)</span>
        </label>
        <button
          onClick={() => setShowEndPicker(v => !v)}
          className="border px-3 py-2 rounded bg-gray-50"
        >
          {recurrence.endDate
            ? format(recurrence.endDate, "yyyy-MM-dd")
            : "Pick an end date"}
        </button>
        {showEndPicker && (
          <div>
            <DayPicker
              mode="single"
              selected={recurrence.endDate}
              onSelect={date => {
                setRecurrence({ ...recurrence, endDate: date });
                setShowEndPicker(false);
              }}
            />
          </div>
        )}
      </div>
      {previewDates.length > 0 && (
        <div className="mt-6">
          <p className="font-semibold mb-1">Preview Next {previewDates.length} Occurrences:</p>
          <ul className="list-disc ml-4">
            {previewDates.map((date) => (
              <li key={date.toISOString()}>{format(date, "PPPP")}</li>
            ))}
          </ul>
        </div>
      )}
      {/* Calendar View */}
      {previewDates.length > 0 && (
        <div className="mt-4">
          <p className="font-semibold mb-1">🗓️ Calendar Preview:</p>
            <DayPicker
              mode="multiple"
              selected={previewDates}
              showOutsideDays
              styles={{
                selected: { backgroundColor: "#4f46e5", color: "white" },
              }}
            />
        </div>
      )}
    </div>
  );
}
