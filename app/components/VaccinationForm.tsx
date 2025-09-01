"use client";
import React, { useState, useEffect } from "react";
import { Vaccine, fetchVaccines } from "@/app/lib/fetchVaccines";

interface VaccinationFormProps {
  dogId: string;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function VaccinationForm({ dogId, onSubmit, onCancel, isLoading }: VaccinationFormProps) {
  const [vaccine, setVaccine] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const [validForValue, setValidForValue] = useState(12);
  const [validForUnit, setValidForUnit] = useState("Months");
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVaccines().then(setVaccines).catch(() => setVaccines([]));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!vaccine || !date) {
      setError("Vaccine and date are required.");
      return;
    }
    try {
      await onSubmit({
        dog: dogId,
        vaccine, // vaccine ID
        date: new Date(date).toISOString(),
        note,
        validFor: { unit: validForUnit, value: Number(validForValue) },
      });
    } catch (err) {
      setError("Failed to add vaccination record.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <div>
        <label className="block text-sm font-medium mb-1">Vaccine *</label>
        <select
          className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          value={vaccine}
          onChange={e => setVaccine(e.target.value)}
          required
        >
          <option value="">Select a vaccine</option>
          {vaccines.map(v => (
            <option key={v._id} value={v._id}>{v.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Date *</label>
        <input
          type="date"
          className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          value={date}
          onChange={e => setDate(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Valid For *</label>
        <div className="flex gap-2">
          <input
            type="number"
            min={1}
            className="w-20 px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            value={validForValue}
            onChange={e => setValidForValue(Number(e.target.value))}
            required
          />
          <select
            className="px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            value={validForUnit}
            onChange={e => setValidForUnit(e.target.value)}
            required
          >
            <option value="Days">Days</option>
            <option value="Weeks">Weeks</option>
            <option value="Months">Months</option>
            <option value="Years">Years</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Notes</label>
        <textarea
          className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          value={note}
          onChange={e => setNote(e.target.value)}
          rows={3}
        />
      </div>
      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded bg-pink-600 text-white font-semibold hover:bg-pink-700 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Add Record"}
        </button>
      </div>
    </form>
  );
}
