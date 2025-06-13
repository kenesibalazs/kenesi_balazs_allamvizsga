import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Select, Layout } from 'antd';
import useOccasions from '../hooks/useOccasions';
import useAttendance from '../hooks/useAttendance';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';

const History: React.FC = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const [occasions, setOccasions] = useState<any[]>([]);
  const [selectedOccasionId, setSelectedOccasionId] = useState<string | null>(null);
  const [loadingOccasion, setLoadingOccasion] = useState(false);
  const { fetchOccasionsBySubjectId } = useOccasions();
  const { fetchAttendancesByOccasionId, occasionsAttendances, loading, error } = useAttendance();

  useEffect(() => {
    const loadOccasions = async () => {
      if (!subjectId) return;
      try {
        const fetched = await fetchOccasionsBySubjectId(subjectId);
        setOccasions(fetched);
      } catch (err) {
        console.error('Failed to load occasions', err);
      }
    };
    loadOccasions();
  }, [subjectId]);

  const handleSelect = async (occasionId: string) => {
    console.log("Selected occasion ID:", occasionId);
    setSelectedOccasionId(occasionId);
    setLoadingOccasion(true);

    try {
      const data = await fetchAttendancesByOccasionId(occasionId);
      console.log("Fetched attendances for selected occasion:", data);
    } catch (error) {
      console.error("Failed to fetch attendances:", error);
    } finally {
      setLoadingOccasion(false);
    }
  };



  return (
    <Layout>
      <div className="content">
        <div className='card'>
          <div className='header'>
            <div className='header-left'>
              <h3 className="big-label">Select an Occasion</h3>
              <Select
                placeholder="Select an occasion"
                style={{ minWidth: 300 }}
                onChange={handleSelect}
                options={occasions.map((occasion) => ({
                  label: occasion.groupIds && Array.isArray(occasion.groupIds)
                    ? occasion.groupIds.map((group: any) => group.name).join(', ')
                    : 'Unnamed Occasion',
                  value: occasion._id
                }))}
                className="costum-select"
              />
            </div>
            <div className='header-right'>
              {selectedOccasionId &&
                occasionsAttendances &&
                occasionsAttendances.some(att => att.participants && att.participants.length > 0) && (
                  <div className="dropdown-tab-style">
                    <select
                      value=''
                      style={{ appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none' }}
                      onChange={(e) => {
                        const selected = e.target.value as 'csv' | 'pdf';
                        if (!occasionsAttendances || occasionsAttendances.length === 0) return;

                        const participantMap: { [userId: string]: { name: string; statuses: string[] } } = {};
                        occasionsAttendances.forEach((attendance: any) => {
                          attendance.participants.forEach((participant: any) => {
                            const userId = participant.userId?._id || participant.userId;
                            const name = participant.userId?.name || 'Unknown';
                            if (!participantMap[userId]) {
                              participantMap[userId] = { name, statuses: [] };
                            }
                            participantMap[userId].statuses.push(participant.status === 'present' ? 'Present' : 'Absent');
                          });
                        });

                        const headers = ['#', 'Name', ...occasionsAttendances.map((_, idx) => `${idx + 1}`)];
                        const rows = Object.entries(participantMap).map(([userId, { name, statuses }], index) => [
                          index + 1,
                          name,
                          ...statuses,
                        ]);

                        if (selected === 'csv') {
                          const csvRows = [headers.join(','), ...rows.map(row => row.join(','))];
                          const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
                          saveAs(blob, 'attendance.csv');
                        } else if (selected === 'pdf') {
                          const doc = new jsPDF();
                          autoTable(doc, { head: [headers], body: rows });
                          doc.save('attendance.pdf');
                        }
                      }}
                    >
                      <option value="" disabled>Download</option>
                      <option value="csv">Download as CSV</option>
                      <option value="pdf">Download as PDF</option>
                    </select>
                  </div>
                )}
            </div>
          </div>
          {loadingOccasion ? (
            <p>Loading attendance data...</p>
          ) : (
            selectedOccasionId && (
              <div>
                {occasionsAttendances &&
                  occasionsAttendances.some(att => att.participants && att.participants.length > 0) ? (
                  <>
                    {console.log("Rendering attendances:", occasionsAttendances)}
                    <div style={{ marginTop: '20px', overflow: 'auto', maxHeight: '400px' }} className="attendance-scroll-wrapper">
                      <table className="attendance-table" style={{ width: '100%' }}>
                        <thead>
                          <tr>
                            <th>#</th>
                            <th className="sticky-column">Name</th>
                            <th className="sticky-column">Present</th>
                            {occasionsAttendances.map((attendance: any, idx: number) => (
                              <th key={attendance._id} style={{ textAlign: 'center' }}>{idx + 1}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {(() => {
                            const participantMap: { [userId: string]: { name: string; statuses: string[] } } = {};

                            occasionsAttendances.forEach((attendance: any) => {
                              attendance.participants.forEach((participant: any) => {
                                const userId = participant.userId?._id || participant.userId;
                                const name = participant.userId?.name || 'Unknown';
                                if (!participantMap[userId]) {
                                  participantMap[userId] = { name, statuses: [] };
                                }
                                participantMap[userId].statuses.push(participant.status === 'present' ? 'Present' : 'Absent');
                              });
                            });

                            return Object.entries(participantMap).map(([userId, { name, statuses }], index) => (
                              <tr key={userId}>
                                <td>{index + 1}</td>
                                <td className="sticky-column">{name}</td>
                                <td className="sticky-column">{statuses.filter(s => s === 'Present').length} / {statuses.length}</td>
                                {statuses.map((status, i) => (
                                  <td
                                    key={i}
                                    className={status === 'Present' ? 'status-present' : 'status-absent'}
                                    style={{ textAlign: 'center', minWidth: '70px' }}
                                  >
                                    {status}
                                  </td>
                                ))}
                              </tr>
                            ));
                          })()}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  <p style={{ marginTop: '20px' }}>No attendance was recorded for this occasion :(</p>
                )}
              </div>
            )
          )}
        </div>
      </div>

    </Layout>
  );
};

export default History;