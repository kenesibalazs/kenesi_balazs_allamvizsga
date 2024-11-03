// DayView.tsx
import { Layout } from 'antd';
import React from 'react';
import './Timetable.css'

const DayView: React.FC = () => {
    return (
       <Layout>
         <table id="timetable" style={{width: '100%'}}>
                    <thead>

                        <tr>
                            <th>Time</th>
                            <th>Day</th>


                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
       </Layout>
    );
};

export default DayView;
