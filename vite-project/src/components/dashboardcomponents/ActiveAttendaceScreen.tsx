/* eslint-disable */
import React, { useState } from 'react';
import { Form, Select } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
const { Option } = Select;
// removed incorrect import

import { Attendance } from '../../types/apitypes';
import useAttendance from '../../hooks/useAttendance';
import { useAuth } from '../../context/AuthContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';

import './StudentList.css';

const filterOptions = [
  { label: 'All', value: 'all' },
  { label: 'Present', value: 'present' },
  { label: 'Absent', value: 'absent' },
];

const ActiveAttendanceScreen = ({ attendance }: { attendance: Attendance }) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'present' | 'absent'>('all');
  const [sortOption, setSortOption] = useState<'name_asc' | 'name_desc' | 'status_asc' | 'status_desc'>('name_asc');

  const [showModal, setShowModal] = useState(false);
  const [downloadType, setDownloadType] = useState<'csv' | 'pdf' | null>(null);
  const [modalTitle, setModalTitle] = useState('');
  const [modalFilter, setModalFilter] = useState<'all' | 'present' | 'absent'>('all');
  const [modalComment, setModalComment] = useState('');

  const { endAttendance } = useAttendance();

  const { userData, logout } = useAuth();

  if (!userData) {
    logout();
    return null;
  }


  const handleEndPress = async () => {
    const confirmed = window.confirm('Are you sure you want to end this attendance session?');
    if (!confirmed) return;

    try {
      const isSuccess = await endAttendance(attendance._id, userData._id);

      if (isSuccess) {
        alert('Attendance session ended successfully.');
        window.location.reload();
      } else {
        alert('Failed to end the attendance session.');
      }
    } catch (error) {
      console.error('Error ending attendance:', error);
      alert('An error occurred while ending the attendance session.');
    }
  };

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

      <div className="header-container-navigation ">
        <p className='header-title-label '>{(attendance.subjectId as any).name}</p>

        <nav className="tab-bar">
          {filterOptions.map(option => (
            <button
              key={option.value}
              className={filterStatus === option.value ? 'active' : ''}
              onClick={() => setFilterStatus(option.value as 'all' | 'present' | 'absent')}
            >
              {option.label}
            </button>
          ))}
        </nav>


        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div className="dropdown-tab-style">
            <select
              value={downloadType ?? ''}
              onChange={(e) => {
                const value = e.target.value as 'csv' | 'pdf';
                setDownloadType(value);
                setShowModal(true);
              }}
            >
              <option value="" disabled>Download</option>
              <option value="csv">CSV</option>
              <option value="pdf">PDF</option>
            </select>
          </div>
          <button className="end-attendance-btn" onClick={handleEndPress}>
            End
          </button>
        </div>
      </div>



      <table className="attendance-table">
        <thead>
          <tr>
            <th style={{ textAlign: 'center', }}>#</th>
            <th onClick={() => toggleSort('name')}>
              Name {sortOption.includes('name') ? (sortOption === 'name_asc' ? '↑' : '↓') : ''}
            </th>
            <th style={{ textAlign: 'center', }}>Group</th>
            <th onClick={() => toggleSort('status')} style={{ textAlign: 'center' }}>
              Status {sortOption.includes('status') ? (sortOption === 'status_asc' ? '↑' : '↓') : ''}
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredParticipants.map((p, index) => {
            const user = p.userId as any;
            console.log('Full user data:', user);

            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td className='participants'>
                  {user.profileImage ? (
                    <img src={user.profileImage} alt="profile" className="profile-img" />
                  ) : (
                    <div className="profile-placeholder">
                      {user.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                  )}
                  <span className='participant-info'>
                    {user.name}
                  </span>
                </td>

                <td>
                  <span className='participant-department'>
                    {(user.majors || []).map((m: any) => m.name).join(', ') || '-'}
                  </span>
                </td>
                <td className={p.status === 'present' ? 'status-present' : 'status-absent'}>
                  {p.status}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>


      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-content">
              <h3 className="modal-title">Download Options</h3>

              <input
                value={modalTitle}
                onChange={e => setModalTitle(e.target.value)}
                placeholder="Title"
                className="modal-input"
              />

              <textarea
                value={modalComment}
                onChange={e => setModalComment(e.target.value)}
                placeholder="Comment"
                className="modal-textarea"
              />

              <select
                value={modalFilter}
                onChange={e => setModalFilter(e.target.value as 'all' | 'present' | 'absent')}
                className="modal-select"
              >
                <option value="all">All Participants</option>
                <option value="present">Present Only</option>
                <option value="absent">Absent Only</option>
              </select>

              <div className="modal-actions">
                <button
                  className="modal-btn modal-btn-cancel"
                  onClick={() => {
                    setShowModal(false);
                    setDownloadType(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="modal-btn modal-btn-confirm"
                  onClick={() => {
                    const participantsToDownload = attendance.participants.filter(p => modalFilter === 'all' || p.status === modalFilter);
                    if (downloadType === 'csv') {
                      const rows = participantsToDownload.map((p, index) => {
                        const user = p.userId as any;
                        return `${index + 1},${user.name},"${(user.majors || []).map((m: any) => m.name).join(' | ')}",${p.status}`;
                      });
                      const csvContent = `Title: ${modalTitle}\nComment: ${modalComment}\n\nIndex,Name,Majors,Status\n${rows.join('\n')}`;
                      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                      saveAs(blob, 'attendance.csv');
                    } else if (downloadType === 'pdf') {
                      const doc = new jsPDF();
                      doc.text(modalTitle, 10, 10);
                      doc.text(modalComment, 10, 20);
                      autoTable(doc, {
                        head: [['#', 'Name', 'Majors', 'Status']],
                        body: participantsToDownload.map((p, index) => {
                          const user = p.userId as any;
                          return [index + 1, user.name, (user.majors || []).map((m: any) => m.name).join(' | '), p.status];
                        }),
                        startY: 30,
                      });
                      doc.save('attendance.pdf');
                    }
                    setShowModal(false);
                  }}
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveAttendanceScreen;