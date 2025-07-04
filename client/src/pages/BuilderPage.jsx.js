import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import toast from 'react-hot-toast';
import html2pdf from 'html2pdf.js';

// Components (simplified for brevity)
import Toolbar from '../components/builder/Toolbar';
import Section from '../components/builder/Section';
import MinimalistTemplate from '../templates/MinimalistTemplate';
import { useDebounce } from '../hooks/useDebounce';

const BuilderPage = () => {
    const { id } = useParams();
    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(true);
    const debouncedResume = useDebounce(resume, 1500); // Autosave after 1.5s of inactivity
    const resumePreviewRef = useRef();

    useEffect(() => {
        const fetchResume = async () => {
            try {
                const { data } = await api.get(`/resumes/${id}`);
                setResume(data);
            } catch (error) {
                toast.error("Failed to load resume data.");
            } finally {
                setLoading(false);
            }
        };
        fetchResume();
    }, [id]);

    // Autosave effect
    useEffect(() => {
        if (debouncedResume) {
            const autosave = async () => {
                try {
                    await api.put(`/resumes/${id}`, debouncedResume);
                    toast.success('Progress saved!', { id: 'autosave-toast' });
                } catch (error) {
                    toast.error('Failed to save progress.', { id: 'autosave-toast' });
                }
            };
            autosave();
        }
    }, [debouncedResume, id]);
    
    const handleContentChange = (sectionId, newContent) => {
        setResume(prev => ({
            ...prev,
            sections: prev.sections.map(sec => 
                sec.id === sectionId ? { ...sec, content: newContent } : sec
            )
        }));
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(resume.sections);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setResume(prev => ({ ...prev, sections: items }));
    };

    const handleExportPDF = () => {
        const element = resumePreviewRef.current;
        const opt = {
          margin:       0,
          filename:     `${resume.slug || 'resume'}.pdf`,
          image:        { type: 'jpeg', quality: 0.98 },
          html2canvas:  { scale: 2, useCORS: true },
          jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
        };
        toast.promise(html2pdf().set(opt).from(element).save(), {
            loading: 'Generating PDF...',
            success: 'PDF downloaded!',
            error: 'Could not generate PDF.',
        });
    };

    if (loading) return <div className="text-center p-10">Loading Builder...</div>;
    if (!resume) return <div className="text-center p-10">Resume not found.</div>;

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            {/* Left: Editor Panel */}
            <div className="w-1/3 p-4 overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">Edit Sections</h2>
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="sections">
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                {resume.sections.map((section, index) => (
                                    <Draggable key={section.id} draggableId={section.id} index={index}>
                                        {(provided) => (
                                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                <Section
                                                    section={section}
                                                    onChange={handleContentChange}
                                                />
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>

            {/* Right: Preview Panel */}
            <div className="w-2/3 p-4 flex flex-col">
                <Toolbar onExportPDF={handleExportPDF} resume={resume} setResume={setResume} />
                <div className="flex-grow bg-white shadow-lg overflow-y-auto">
                    <div ref={resumePreviewRef}>
                        {/* Dynamically render template based on resume data */}
                        {resume.template === 'minimalist' && <MinimalistTemplate resumeData={resume} />}
                        {/* {resume.template === 'modern' && <ModernTemplate resumeData={resume} />} */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuilderPage;