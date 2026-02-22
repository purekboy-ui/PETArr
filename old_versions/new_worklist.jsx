// ============ 放射師工作清單 ============
        const WorklistTab = ({ schedule, result }) => {
            const worklist = useMemo(() => generateWorklist(schedule), [schedule]);

            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} className="fade-in">
                    {/* 工作清單 */}
                    <div className="card printable-section" style={{ overflow: 'hidden', border: 'none', boxShadow: 'none' }}>
                        <div style={{
                            padding: '24px',
                            borderBottom: '2px solid var(--slate-200)',
                            background: 'white'
                        }}>
                            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: 'var(--slate-800)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <i className="fa-solid fa-clipboard-check" style={{ color: 'var(--teal-600)' }}></i>
                                攝影順序表 (執行清單)
                            </h3>
                            <p style={{ margin: '6px 0 0 0', fontSize: '14px', color: 'var(--slate-500)' }}>
                                請依照下方時間軸順序執行攝影。實體列印後可於左側方格打勾確認。
                            </p>
                        </div>

                        <div style={{ padding: '32px 24px', background: 'white' }}>
                            {worklist.length > 0 ? (
                                <div className="timeline">
                                    {worklist.map((task, idx) => {
                                        const isDelayed = task.type === 'DELAYED';
                                        const isPosluma = task.patientType === 'POSLUMA';
                                        
                                        // Color logic
                                        const dotClass = isDelayed ? 'delayed' : 'early';
                                        const bgStyle = isDelayed
                                            ? { background: 'var(--orange-50)', border: '1px solid var(--orange-100)' }
                                            : { background: 'var(--navy-50)', border: '1px solid var(--navy-100)' };
                                        
                                        const tagColor = isDelayed ? 'var(--orange-600)' : 'var(--navy-600)';
                                        const tagBg = isDelayed ? 'var(--orange-100)' : 'var(--navy-100)';
                                        const iconClass = isDelayed ? 'fa-regular fa-clock' : 'fa-solid fa-bolt';
                                        const typeLabel = isDelayed ? 'Delayed' : 'Early';
                                        
                                        const drugColor = isPosluma ? 'var(--teal-700)' : 'var(--slate-600)';
                                        const drugBg = isPosluma ? 'var(--teal-100)' : 'var(--slate-100)';

                                        return (
                                            <div key={idx} className="timeline-item">
                                                <div className={`timeline-dot ${dotClass}`}></div>
                                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                                    {/* 實體打勾方塊 */}
                                                    <div className="custom-checkbox"></div>
                                                    
                                                    {/* 時間區塊 */}
                                                    <div style={{ minWidth: '110px', paddingTop: '1px' }}>
                                                        <div className="font-mono print-bold" style={{
                                                            fontSize: '18px',
                                                            fontWeight: 700,
                                                            color: 'var(--slate-800)',
                                                            lineHeight: '1.2'
                                                        }}>
                                                            {minutesToTime(task.time)}
                                                        </div>
                                                        <div className="font-mono" style={{ fontSize: '13px', color: 'var(--slate-500)', marginTop: '2px' }}>
                                                            ~ {minutesToTime(task.endTime)}
                                                        </div>
                                                    </div>

                                                    {/* 任務卡片 */}
                                                    <div style={{
                                                        flex: 1,
                                                        padding: '12px 16px',
                                                        borderRadius: '8px',
                                                        ...bgStyle,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        flexWrap: 'wrap',
                                                        gap: '12px'
                                                    }} className="print-border-solid">
                                                        
                                                        <div style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '8px',
                                                            minWidth: '100px'
                                                        }}>
                                                            <span style={{
                                                                background: drugBg,
                                                                color: drugColor,
                                                                padding: '2px 6px',
                                                                borderRadius: '4px',
                                                                fontSize: '11px',
                                                                fontWeight: 700
                                                            }}>{isPosluma ? 'Posluma' : 'FDG'}</span>
                                                            <span className="font-mono print-bold" style={{ fontWeight: 700, fontSize: '15px', color: 'var(--slate-700)' }}>
                                                                {task.patientId}
                                                            </span>
                                                        </div>

                                                        <div style={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '6px',
                                                            color: tagColor,
                                                            fontSize: '13px',
                                                            fontWeight: 600
                                                        }}>
                                                            <i className={iconClass}></i> 
                                                            <span className="print-bold">{typeLabel}</span>
                                                            {isDelayed && <span className="print-only" style={{ marginLeft: '4px', fontWeight: 800 }}>[⚠ 延遲造影]</span>}
                                                        </div>

                                                        <div style={{ fontSize: '13px', color: 'var(--slate-500)', marginLeft: 'auto' }}>
                                                            {task.duration} min
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div style={{ padding: '48px', textAlign: 'center', color: 'var(--slate-400)' }}>
                                    <i className="fa-regular fa-folder-open" style={{ fontSize: '40px', marginBottom: '12px', display: 'block' }}></i>
                                    <p>尚未產生排程</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 列印簽名欄 */}
                    <div className="print-only" style={{ background: 'white', padding: '24px 0', marginTop: '16px', borderTop: '2px dashed var(--slate-300)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <p style={{ fontSize: '15px', color: '#000', fontWeight: 600 }}>執行放射師簽名：__________________</p>
                            <p className="font-mono" style={{ fontSize: '15px', color: '#000', fontWeight: 600 }}>日期：{new Date().toLocaleDateString('zh-TW')}</p>
                        </div>
                    </div>
                </div>
            );
        };
