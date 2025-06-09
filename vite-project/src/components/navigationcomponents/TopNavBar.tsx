import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DownOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import './TopNavBar.css';

interface SearchItem {
    label: string;
    path: string;
    type: 'page' | 'user' | 'subject' | 'occasion';
}

const TopNavBar: React.FC = () => {
    const { userData, logout } = useAuth();
    const [query, setQuery] = useState('');
    const [showPalette, setShowPalette] = useState(false);
    const [searchItems, setSearchItems] = useState<SearchItem[]>([]);
    const [filteredItems, setFilteredItems] = useState<SearchItem[]>([]);
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setShowPalette(true);
                setTimeout(() => {
                    inputRef.current?.focus();
                }, 0);
            }
            if (e.key === 'Escape') {
                setShowPalette(false);
            }
            if (showPalette) {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setHighlightedIndex((prev) =>
                        prev === filteredItems.length - 1 ? 0 : prev + 1
                    );
                }
                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setHighlightedIndex((prev) =>
                        prev === 0 ? filteredItems.length - 1 : prev - 1
                    );
                }
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const item = filteredItems[highlightedIndex];
                    if (item) {
                        window.location.href = item.path;
                        setShowPalette(false);
                    }
                }
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [showPalette, filteredItems, highlightedIndex]);

    useEffect(() => {
        setFilteredItems(
            searchItems.filter(item =>
                item.label.toLowerCase().includes(query.toLowerCase())
            )
        );
        setHighlightedIndex(0);
    }, [query, searchItems]);

    useEffect(() => {
        // Simulate your backend or source data
        const users = [{ _id: '1', name: 'Alice', neptunCode: 'ALC' }];
        const subjects = [{ _id: 's1', name: 'Math' }];
        const occasions = [{ _id: 'o1', subjectId: 's1', startTime: '2025-06-09T10:00:00Z' }];

        const staticPages: SearchItem[] = [
            { label: 'Dashboard', path: '/dashboard', type: 'page' },
            { label: 'Timetable', path: '/timetable', type: 'page' },
            { label: 'Notices', path: '/notices', type: 'page' },
            { label: 'Settings', path: '/settings', type: 'page' },
        ];

        const userItems = users.map(u => ({
            label: `${u.name} (${u.neptunCode})`,
            path: `/users/${u._id}`,
            type: 'user' as const,
        }));

        const subjectItems = subjects.map(s => ({
            label: s.name,
            path: `/subjects/${s._id}`,
            type: 'subject' as const,
        }));

        const occasionItems = occasions.map(o => ({
            label: `Occasion: ${new Date(o.startTime).toLocaleString()}`,
            path: `/occasions/${o._id}`,
            type: 'occasion' as const,
        }));

        setSearchItems([...staticPages, ...userItems, ...subjectItems, ...occasionItems]);
    }, []);

    return (
        <div className="topnav-container">
            <div className="search-section">
                <input
                    ref={inputRef}
                    type="text"
                    className="topnav-search"
                    placeholder="Search..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setShowPalette(true)}
                />
                {showPalette && (
                    <ul className="command-palette" role="listbox">
                        {filteredItems.map((item, index) => (
                            <li
                                key={index}
                                className={highlightedIndex === index ? 'active' : ''}
                                role="option"
                                tabIndex={0}
                                onClick={() => {
                                    window.location.href = item.path;
                                    setShowPalette(false);
                                }}
                                onMouseEnter={() => setHighlightedIndex(index)}
                            >
                                {item.label}
                            </li>
                        ))}
                        {filteredItems.length === 0 && (
                            <li className="no-result">No results found</li>
                        )}
                    </ul>
                )}
            </div>
            <div className={`profile-section${dropdownVisible ? ' open' : ''}`} onClick={() => setDropdownVisible(!dropdownVisible)}>
                <img
                    src={userData?.profileImage}
                    alt="Profile"
                    className="topnav-profile-image"
                />
                <div className="profile-label">
                    <span className="user-name">{userData?.name}</span>
                    <DownOutlined className="arrow-down" />
                </div>
                {dropdownVisible && (
                    <ul className="profile-dropdown">
                        <li onClick={() => (window.location.href = '/profile')}>
                            <UserOutlined style={{ marginRight: 8 }} />
                            Profile
                        </li>
                        <li onClick={logout}>
                            <LogoutOutlined style={{ marginRight: 8 }} />
                            Logout
                        </li>
                    </ul>
                )}
            </div>
        </div>
    );
};

export default TopNavBar;
