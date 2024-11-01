import React, { useEffect, useState } from 'react';
import { Typography, Layout, Modal } from 'antd';
import Sidebar from '../components/Sidebar';
import TopNavBar from '../components/TopNavBar';
import useOccasions from '../hooks/useOccasions';
import { usePeriod } from '../hooks/usePeriod';
import useSubject from '../hooks/useSubject';

import './Timetable.css'; // Import the CSS file
import { Occasion } from '../types/apitypes';

const { Content } = Layout;
const { Title } = Typography;

const Timetable: React.FC = () => {
    const { occasions, fetchOccasions } = useOccasions();
    const { periods, fetchPeriods } = usePeriod();
    const { subjects, fetchAllSubjectsData } = useSubject();

    const [selectedOccasion, setSelectedOccasion] = useState<Occasion | null>(null); // State to track selected occasion
    const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility

    // Fetch data on component mount
    useEffect(() => {
        fetchOccasions('*49');
        fetchPeriods();
        fetchAllSubjectsData();
    }, [fetchOccasions, fetchPeriods, fetchAllSubjectsData]);

    const currentDate = new Date();
    const currentDay = currentDate.getDay();
    const adjustedCurrentDay = (currentDay + 6) % 7;

    const getDayNumbers = () => {
        const dayNumbers = [];
        const firstDayOfWeek = new Date(currentDate);
        const dayOffset = (currentDay + 6) % 7;
        firstDayOfWeek.setDate(currentDate.getDate() - dayOffset);

        for (let i = 0; i < 5; i++) {
            dayNumbers.push(firstDayOfWeek.getDate());
            firstDayOfWeek.setDate(firstDayOfWeek.getDate() + 1);
        }

        return dayNumbers;
    };

    const dayNumbers = getDayNumbers(); // Get the day numbers for the week

    const days = [
        { id: '10000', name: "Monday" },
        { id: '01000', name: "Tuesday" },
        { id: '00100', name: "Wednesday" },
        { id: '00010', name: "Thursday" },
        { id: '00001', name: "Friday" }
    ];

    // Handler to show modal with occasion details
    const showModal = (occasion: Occasion) => {
        setSelectedOccasion(occasion);
        setIsModalVisible(true);
    };

    // Handler to close the modal
    const handleCancel = () => {
        setIsModalVisible(false);
        setSelectedOccasion(null);
    };

    return (
        <Layout className="layout">
            <Sidebar />
            <TopNavBar />
            <Content className="content">
                <Title level={2}>Timetable</Title>
                <table id="timetable">
                    <thead>
                        <tr>
                            <th>Time</th>
                            {days.map((day, index) => (
                                <th key={day.id} className={index === adjustedCurrentDay ? 'highlight' : ''}>
                                    {day.name}
                                </th>
                            ))}
                        </tr>
                        <tr>
                            <th> </th>
                            {dayNumbers.map((dateNum, index) => (
                                <th key={index} className={index === adjustedCurrentDay ? 'highlight' : ''}>
                                    {dateNum}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {periods.map(period => (
                            <tr key={period.id}>
                                <td>{period.starttime}</td>
                                {days.map((day, index) => {
                                    const occasion = occasions.find(o => o.dayId === day.id && o.timeId === period.id);
                                    const isToday = index === adjustedCurrentDay; // Check if this is today's index

                                    if (occasion) {
                                        const subject = subjects.find(s => s.timetableId.toString() === occasion.subjectId.toString());
                                        const subjectName = subject ? subject.name : 'Unknown Subject';

                                        return (
                                            <td
                                                key={day.id}
                                                className={`occupied ${isToday ? 'highlight' : ''}`}
                                                onClick={() => showModal(occasion)} // Click event to show modal
                                            >
                                                {subjectName}
                                                {` (Class: ${occasion.classroomId.join(', ')}, Teacher: ${occasion.teacherId.join(', ')})`}
                                            </td>
                                        );
                                    } else {
                                        return <td key={day.id} className={isToday ? 'highlight' : ''}></td>;
                                    }
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Modal to show selected occasion details */}
                <Modal
                    title="Class Details"
                    visible={isModalVisible}
                    onCancel={handleCancel}
                    footer={null} // You can add footer buttons here if needed
                >
                    {selectedOccasion && (
                        <div>
                            <p><strong>Subject ID:</strong> {selectedOccasion.subjectId}</p>
                            <p><strong>Classroom ID(s):</strong> {selectedOccasion.classroomId.join(', ')}</p>
                            <p><strong>Teacher ID(s):</strong> {selectedOccasion.teacherId.join(', ')}</p>
                            <p><strong>Group ID(s):</strong> {selectedOccasion.groupIds.join(', ')}</p>
                        </div>
                    )}
                </Modal>
            </Content>
        </Layout>
    );
};

export default Timetable;
