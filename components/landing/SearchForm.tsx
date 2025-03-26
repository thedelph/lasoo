'use client';

import { FormEvent } from 'react';
import { Search } from 'lucide-react';

interface SearchFormProps {
  postcode: string;
  onPostcodeChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
}

export default function SearchForm({
  postcode,
  onPostcodeChange,
  onSubmit,
}: SearchFormProps) {
  return (
    <form onSubmit={onSubmit} className="join w-full max-w-md">
      <input
        className="input input-bordered join-item flex-1"
        placeholder="Enter your postcode"
        type="text"
        value={postcode}
        onChange={(e) => onPostcodeChange(e.target.value)}
        required
      />
      <button type="submit" className="btn btn-primary join-item">
        <Search className="h-4 w-4 mr-2" />
        Find
      </button>
    </form>
  );
}
