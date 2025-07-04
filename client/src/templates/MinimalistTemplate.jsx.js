import React from 'react';

// A simple functional component that renders the resume data in a clean, minimalist layout.
const MinimalistTemplate = ({ resumeData }) => {
    const { customization, sections, profilePicture, user } = resumeData;
    const style = {
        fontFamily: customization?.font || 'Arial, sans-serif',
        color: customization?.color || '#333',
    };

    const getSectionComponent = (section) => {
        switch (section.type) {
            case 'summary':
                return <div dangerouslySetInnerHTML={{ __html: section.content.text }} />;
            case 'experience':
                return (
                    <ul>
                        {section.content.items.map((item, index) => (
                            <li key={index} className="mb-4">
                                <h4 className="font-bold">{item.title} at {item.company}</h4>
                                <p className="text-sm text-gray-600">{item.startDate} - {item.endDate}</p>
                                <div className="prose" dangerouslySetInnerHTML={{ __html: item.description }} />
                            </li>
                        ))}
                    </ul>
                );
            // Add cases for 'education', 'skills', etc.
            default:
                return null;
        }
    };

    return (
        <div className="p-10 bg-white" style={style}>
            <header className="text-center mb-8">
                {profilePicture && <img src={profilePicture} alt="Profile" className="w-24 h-24 rounded-full mx-auto mb-4" />}
                <h1 className="text-4xl font-bold">{user?.name || "Your Name"}</h1>
                <p>Contact Info Here</p>
            </header>

            <main>
                {sections.map(section => (
                    <div key={section.id} className="mb-6">
                        <h3 className="text-2xl font-semibold border-b-2 pb-1 mb-3">{section.title}</h3>
                        {getSectionComponent(section)}
                    </div>
                ))}
            </main>
        </div>
    );
};

export default MinimalistTemplate;