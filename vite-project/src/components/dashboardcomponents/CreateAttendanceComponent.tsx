import React, { useState, useEffect } from 'react';
import { Occasion, Subject, Classroom } from '../../types/apitypes';
import { Form, Select, Typography, Button } from 'antd';

const { Option } = Select;

interface CreateAttendanceComponentProps {
    currentOccasion: Occasion | null;
    nextOccasion: Occasion | null;
    subjects: Subject[];
    classrooms: Classroom[];
}

const CreateAttendanceComponent: React.FC<CreateAttendanceComponentProps> = ({
    currentOccasion,
    nextOccasion,
    subjects,
    classrooms
}) => {
    const [activeTab, setActiveTab] = useState<string>('Next');
    const [selectedSubject, setSelectedSubject] = useState<Subject | undefined>(undefined);
    const [selectedClassroom, setSelectedClassroom] = useState<Classroom | undefined>(undefined);

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);

        if (tab === 'Current' && currentOccasion) {
            const subject = subjects.find(s => s.timetableId === currentOccasion.subjectId);
            setSelectedSubject(subject);

            const classroom = classrooms.find(c => c.id === currentOccasion.classroomId[0]);
            setSelectedClassroom(classroom);
        } else if (tab === 'Next' && nextOccasion) {
            const subject = subjects.find(s => s.timetableId === nextOccasion.subjectId);
            setSelectedSubject(subject);

            const classroom = classrooms.find(c => c.id === nextOccasion.classroomId[0]);
            setSelectedClassroom(classroom);
        } else if (tab === 'Custom') {
            setSelectedSubject(undefined);
            setSelectedClassroom(undefined);
        }
    };

    useEffect(() => {
        if (activeTab === 'Next' && nextOccasion) {
            const subject = subjects.find(s => s.timetableId === nextOccasion.subjectId);
            setSelectedSubject(subject);

            const classroom = classrooms.find(c => c.id === nextOccasion.classroomId[0]);
            setSelectedClassroom(classroom);
        } else if (activeTab === 'Current' && currentOccasion) {
            const subject = subjects.find(s => s.timetableId === currentOccasion.subjectId);
            setSelectedSubject(subject);

            const classroom = classrooms.find(c => c.id === currentOccasion.classroomId[0]);
            setSelectedClassroom(classroom);
        }
    }, [activeTab, currentOccasion, nextOccasion, subjects, classrooms]);

    const handleSubmit = () => {
        console.log(`Subject: ${selectedSubject?.name || 'Unknown Subject'} ${selectedSubject?._id || ''}`);
        console.log(`Classroom: ${selectedClassroom?.name || 'Unknown Classroom'} ${selectedClassroom?._id || ''}`);
    };

    const renderTabContent = () => {
        if (activeTab === 'Custom') {
            return (
                <Form layout="vertical">
                    <Typography.Title level={4} className="title">
                        Create your custom class
                    </Typography.Title>

                    <Form.Item
                        label="Custom Subject"
                        name="customSubject"
                        labelCol={{ span: 24 }}
                        wrapperCol={{ span: 24 }}
                    >
                        <Select
                            placeholder="Select a subject"
                            value={selectedSubject?._id}
                            onChange={(value) => {
                                const subject = subjects.find(s => s._id === value);
                                setSelectedSubject(subject);
                            }}
                        >
                            {subjects.map(subject => (
                                <Option key={subject._id} value={subject._id}>
                                    {subject.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Custom Classroom"
                        name="customClassroom"
                        labelCol={{ span: 24 }}
                        wrapperCol={{ span: 24 }}
                    >
                        <Select
                            placeholder="Select a classroom"
                            value={selectedClassroom?.id}
                            onChange={(value) => {
                                const classroom = classrooms.find(c => c.id === value);
                                setSelectedClassroom(classroom);
                            }}
                        >
                            {classrooms.map(classroom => (
                                <Option key={classroom.id} value={classroom.id}>
                                    {classroom.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Button type="primary" onClick={handleSubmit}>
                        Submit Custom Class
                    </Button>
                </Form>
            );
        }
        else if (activeTab === 'Next') {

            return (
                <Form layout="vertical">
                    <Typography.Title level={4} className="title">
                        Start your class
                    </Typography.Title>

                    <Form.Item
                        label="Subject"
                        name="subject"
                        labelCol={{ span: 24 }}
                        wrapperCol={{ span: 24 }}
                    >
                        <Select
                            placeholder={selectedSubject?.name || 'Select a subject'}
                            value={selectedSubject?._id}
                            disabled
                        >
                            {subjects.map(subject => (
                                <Option key={subject._id} value={subject._id}>
                                    {subject.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Classroom"
                        name="classroom"
                        labelCol={{ span: 24 }}
                        wrapperCol={{ span: 24 }}
                    >
                        <Select
                            placeholder={selectedClassroom?.name || 'Select a classroom'}
                            value={selectedClassroom?.id}
                            disabled
                        >
                            {classrooms.map(classroom => (
                                <Option key={classroom.id} value={classroom.id}>
                                    {classroom.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Button type="primary" onClick={handleSubmit}>
                        Submit
                    </Button>
                </Form>
            )
        }
        else if (activeTab === 'Current') {
            return (
                <Form layout="vertical">
                    <Typography.Title level={4} className="title">
                        Prepare for your next class
                    </Typography.Title>

                    <Form.Item
                        label="Subject"
                        name="subject"
                        labelCol={{ span: 24 }}
                        wrapperCol={{ span: 24 }}
                    >
                        <Select
                            placeholder={selectedSubject?.name || 'Select a subject'}
                            value={selectedSubject?._id}
                            disabled
                        >
                            {subjects.map(subject => (
                                <Option key={subject._id} value={subject._id}>
                                    {subject.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Classroom"
                        name="classroom"
                        labelCol={{ span: 24 }}
                        wrapperCol={{ span: 24 }}
                    >
                        <Select
                            placeholder={selectedClassroom?.name || 'Select a classroom'}
                            value={selectedClassroom?.id}
                            disabled
                        >
                            {classrooms.map(classroom => (
                                <Option key={classroom.id} value={classroom.id}>
                                    {classroom.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Button type="primary" onClick={handleSubmit}>
                        Submit
                    </Button>
                </Form>
            )
        }
    };

    return (
        <div className="create-attendance-layout">
            <div className="create-attendance-tabs">
                <a
                    className={`tablinks ${activeTab === 'Custom' ? 'active' : ''}`}
                    onClick={() => handleTabClick('Custom')}
                >
                    Custom
                </a>
                <a
                    className={`tablinks ${activeTab === 'Current' ? 'active' : ''}`}
                    onClick={() => handleTabClick('Current')}
                >
                    Current
                </a>
                <a
                    className={`tablinks ${activeTab === 'Next' ? 'active' : ''}`}
                    onClick={() => handleTabClick('Next')}
                >
                    Next
                </a>
            </div>

            <div className="create-attendance-content">{renderTabContent()}</div>
        </div>
    );
};

export default CreateAttendanceComponent;
