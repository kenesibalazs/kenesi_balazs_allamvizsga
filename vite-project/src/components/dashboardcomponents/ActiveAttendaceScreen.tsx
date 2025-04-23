/* eslint-disable */
import React, { useState } from 'react';
import { Attendance } from '../../types/apitypes';

const filterOptions = [
  { label: 'All', value: 'all' },
  { label: 'Present', value: 'present' },
  { label: 'Absent', value: 'absent' },
];

const ActiveAttendanceScreen = ({ attendance }: { attendance: Attendance }) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'present' | 'absent'>('all');
  const [sortOption, setSortOption] = useState<'name_asc' | 'name_desc' | 'status_asc' | 'status_desc'>('name_asc');

  const toggleSort = (field: 'name' | 'status') => {
    setSortOption((prev) => {
      if (prev === `${field}_asc`) return `${field}_desc`;
      return `${field}_asc`;
    });
  };

  const filteredParticipants = attendance.participants
    .filter(p => filterStatus === 'all' || p.status === filterStatus)
    .sort((a, b) => {
      if (sortOption.includes('name')) {
        const aName = (a.userId as { name: string }).name;
        const bName = (b.userId as { name: string }).name;
        return sortOption === 'name_asc' ? aName.localeCompare(bName) : bName.localeCompare(aName);
      } else {
        return sortOption === 'status_asc'
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      }
    });

  return (
    <div className="active-attendance-screen-contente">
      <h2>{(attendance.subjectId as any).name}</h2>

      <div style={{ marginBottom: 16 }}>
        {filterOptions.map(option => (
          <button
            key={option.value}
            onClick={() => setFilterStatus(option.value as 'all' | 'present' | 'absent')}
            style={{
              marginRight: 8,
              padding: '6px 12px',
              borderRadius: 8,
              border: filterStatus === option.value ? '2px solid blue' : '1px solid #ccc',
              backgroundColor: filterStatus === option.value ? '#eef' : '#fff',
              cursor: 'pointer'
            }}
          >
            {option.label}
          </button>
        ))}
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ccc' }}>
            <th>#</th>
            <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('name')}>
              Name {sortOption.includes('name') ? (sortOption === 'name_asc' ? '↑' : '↓') : ''}
            </th>
            <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('status')}>
              Status {sortOption.includes('status') ? (sortOption === 'status_asc' ? '↑' : '↓') : ''}
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredParticipants.map((p, index) => {
            const user = p.userId as any;
            return (
              <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                <td>{index + 1}</td>
                <td style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {user.profileImage ? (
                    <img src={user.profileImage} alt="profile" style={{ width: 32, height: 32, borderRadius: '50%' }} />
                  ) : (
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      backgroundColor: 'orange',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold'
                    }}>
                      {user.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                  )}
                  {user.name}
                </td>
                <td style={{ color: p.status === 'present' ? 'green' : 'red', fontWeight: 'bold' }}>{p.status}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ActiveAttendanceScreen;