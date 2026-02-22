// ============ 醫師規劃面板 ============
const PlannerTab = ({ schedule, result, config }) => {
    // 建構甘特圖資料
    const ganttData = useMemo(() => {
        let start = Infinity;
        let end = -Infinity;
        const rows = [];

        if (schedule.length === 0) return { start, end, rows: [], duration: 0 };

        schedule.forEach((p, idx) => {
            if (p.earlyStart < start) start = p.earlyStart;
            if (p.earlyEnd > end) end = p.earlyEnd;

            const row = {
                id: p.id,
                type: p.type || 'FDG',
                early: { start: p.earlyStart, end: p.earlyEnd },
                delayed: null,
            };

            if (p.delayedStart !== null) {
                row.delayed = { start: p.delayedStart, end: p.delayedEnd };
                if (p.delayedEnd > end) end = p.delayedEnd;
            }
            rows.push(row);
        });

        start = Math.max(0, start - 15);
        end = end + 15;

        return {
            start,
            end,
            duration: end - start,
            rows
        };
    }, [schedule]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} className="fade-in">

            {/* 注射時刻表 (表格) */}
            <div id="injection-schedule-table" className="card printable-section" style={{ overflow: 'hidden', border: 'none', boxShadow: 'none' }}>
                <div style={{ padding: '24px', borderBottom: '2px solid var(--slate-200)', background: 'white' }}>
                    <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: 'var(--slate-800)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <i className="fa-solid fa-syringe" style={{ color: 'var(--navy-600)' }}></i>
                        注射時刻表
                    </h3>
                    <p style={{ margin: '6px 0 0 0', fontSize: '14px', color: 'var(--slate-500)' }}>
                        各時段之放射性藥物注射與掃描排程一覽。
                    </p>
                </div>
                <div style={{ overflowX: 'auto', background: 'white' }}>
                    {schedule.length > 0 ? (
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                            <thead>
                                <tr style={{ background: 'var(--slate-50)', color: 'var(--slate-600)', borderBottom: '2px solid var(--slate-200)' }}>
                                    <th style={{ padding: '14px 16px', fontWeight: 600 }}>次序</th>
                                    <th style={{ padding: '14px 16px', fontWeight: 600 }}>檢查藥物</th>
                                    <th style={{ padding: '14px 16px', fontWeight: 600 }}>打藥時間</th>
                                    <th style={{ padding: '14px 16px', fontWeight: 600 }}>Early Scan</th>
                                    <th style={{ padding: '14px 16px', fontWeight: 600 }}>Delayed Scan</th>
                                    <th style={{ padding: '14px 16px', fontWeight: 600 }}>等待間隔</th>
                                </tr>
                            </thead>
                            <tbody className="font-mono">
                                {schedule.map((patient, index) => {
                                    const waitTime = patient.delayedStart ? (patient.delayedStart - patient.earlyEnd) : null;
                                    const isPosluma = patient.type === 'POSLUMA';
                                    const highlightWait = waitTime !== null && (waitTime < config.minWaitLimit || waitTime > config.maxWaitLimit);

                                    return (
                                        <tr key={index} className="table-row" style={{ borderBottom: '1px solid var(--slate-100)' }}>
                                            <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--slate-700)' }}>
                                                {patient.id}
                                            </td>
                                            <td style={{ padding: '12px 16px' }}>
                                                <span style={{
                                                    background: isPosluma ? 'var(--teal-100)' : 'var(--slate-100)',
                                                    color: isPosluma ? 'var(--teal-700)' : 'var(--slate-600)',
                                                    padding: '4px 8px',
                                                    borderRadius: '6px',
                                                    fontSize: '12px',
                                                    fontWeight: 600
                                                }}>{patient.type || 'FDG'}</span>
                                            </td>
                                            <td style={{ padding: '12px 16px', color: 'var(--slate-800)', fontWeight: 600 }}>{minutesToTime(patient.injectionTime)}</td>
                                            <td style={{ padding: '12px 16px', color: 'var(--navy-600)', fontWeight: 600 }}>
                                                {minutesToTime(patient.earlyStart)} - {minutesToTime(patient.earlyEnd)}
                                            </td>
                                            <td style={{ padding: '12px 16px', color: patient.delayedStart ? 'var(--orange-600)' : 'var(--slate-400)', fontWeight: patient.delayedStart ? 600 : 400 }}>
                                                {patient.delayedStart ? `${minutesToTime(patient.delayedStart)} - ${minutesToTime(patient.delayedEnd)}` : '-'}
                                            </td>
                                            <td style={{ padding: '12px 16px' }}>
                                                {waitTime !== null ? (
                                                    <span style={{
                                                        color: highlightWait ? '#dc2626' : 'var(--slate-600)',
                                                        fontWeight: highlightWait ? 700 : 'normal',
                                                        background: highlightWait ? '#fee2e2' : 'transparent',
                                                        padding: highlightWait ? '2px 6px' : '0',
                                                        borderRadius: '4px'
                                                    }}>
                                                        {waitTime} min
                                                    </span>
                                                ) : '-'}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    ) : (
                        <div style={{ padding: '48px', textAlign: 'center', color: 'var(--slate-400)' }}>
                            <i className="fa-regular fa-folder-open" style={{ fontSize: '40px', marginBottom: '12px', display: 'block' }}></i>
                            <p>請在左側輸入參數並調整病人數</p>
                        </div>
                    )}
                </div>
            </div>

            {/* 視覺化甘特圖 (Gantt Chart) */}
            {schedule.length > 0 && (() => {
                const { start, duration, rows } = ganttData;
                const tickInterval = 60; // 1 小時一個刻度
                const firstTick = Math.ceil(start / tickInterval) * tickInterval;
                const ticks = [];
                for (let t = firstTick; t <= ganttData.end; t += tickInterval) {
                    ticks.push(t);
                }

                // 將時間轉為百分比的共用函數
                const getPosition = (t) => ((t - start) / duration) * 100;

                return (
                    <React.Fragment>
                        <div className="no-print card" style={{ padding: '24px', overflowX: 'auto' }}>
                            <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: 700, color: 'var(--slate-800)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <i className="fa-solid fa-chart-gantt" style={{ color: 'var(--slate-400)' }}></i>
                                機台排程分佈圖
                            </h3>
                            <div style={{ minWidth: '600px', position: 'relative' }}>

                                {/* 時間軸刻度 (Header) */}
                                <div style={{ height: '30px', position: 'relative', borderBottom: '1px solid var(--slate-200)', marginBottom: '16px' }}>
                                    {ticks.map((t, i) => (
                                        <div key={i} style={{
                                            position: 'absolute',
                                            left: `${getPosition(t)}%`,
                                            transform: 'translateX(-50%)',
                                            fontSize: '11px',
                                            color: 'var(--slate-500)',
                                            fontWeight: 600
                                        }} className="font-mono">
                                            {minutesToTime(t)}
                                            <div style={{
                                                position: 'absolute',
                                                left: '50%',
                                                top: '16px',
                                                height: '14px',
                                                width: '1px',
                                                background: 'var(--slate-300)'
                                            }}></div>
                                        </div>
                                    ))}
                                </div>

                                {/* 甘特圖本體 */}
                                <div style={{ position: 'relative', paddingBottom: '10px' }}>
                                    {/* 畫背景垂直網格線 */}
                                    {ticks.map((t, i) => (
                                        <div key={i} style={{
                                            position: 'absolute',
                                            left: `${getPosition(t)}%`,
                                            top: 0,
                                            bottom: 0,
                                            width: '1px',
                                            background: 'var(--slate-100)',
                                            zIndex: 0
                                        }}></div>
                                    ))}

                                    {/* 畫每一筆病人的狀態區塊 */}
                                    {rows.map((row, i) => {
                                        const isP = row.type === 'POSLUMA';
                                        // colors
                                        const earlyBg = isP ? 'linear-gradient(90deg, #14b8a6, #0d9488)' : 'linear-gradient(90deg, #0ea5e9, #0284c7)';
                                        const delayedBg = 'linear-gradient(90deg, #f97316, #ea580c)';

                                        return (
                                            <div key={i} style={{
                                                height: '40px',
                                                marginBottom: '8px',
                                                position: 'relative',
                                                display: 'flex',
                                                alignItems: 'center',
                                                zIndex: 1,
                                                background: 'var(--slate-50)',
                                                borderRadius: '6px'
                                            }}>

                                                {/* 左側 Label */}
                                                <div className="font-mono" style={{
                                                    position: 'absolute',
                                                    left: '-60px',
                                                    width: '50px',
                                                    textAlign: 'right',
                                                    fontSize: '12px',
                                                    fontWeight: 600,
                                                    color: 'var(--slate-600)'
                                                }}>
                                                    {row.id}
                                                </div>

                                                {/* Early Block */}
                                                <div style={{
                                                    position: 'absolute',
                                                    left: `${getPosition(row.early.start)}%`,
                                                    width: `${getPosition(row.early.end) - getPosition(row.early.start)}%`,
                                                    height: '24px',
                                                    background: earlyBg,
                                                    borderRadius: '4px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'white',
                                                    fontSize: '10px',
                                                    fontWeight: 600,
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}>E</div>

                                                {/* Delayed Block */}
                                                {row.delayed && (
                                                    <React.Fragment>
                                                        {/* 等待虛線 */}
                                                        <div style={{
                                                            position: 'absolute',
                                                            left: `${getPosition(row.early.end)}%`,
                                                            width: `${getPosition(row.delayed.start) - getPosition(row.early.end)}%`,
                                                            height: '1px',
                                                            borderTop: '1px dashed var(--slate-300)',
                                                            top: '50%'
                                                        }}></div>
                                                        <div style={{
                                                            position: 'absolute',
                                                            left: `${getPosition(row.delayed.start)}%`,
                                                            width: `${getPosition(row.delayed.end) - getPosition(row.delayed.start)}%`,
                                                            height: '24px',
                                                            background: delayedBg,
                                                            borderRadius: '4px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            color: 'white',
                                                            fontSize: '10px',
                                                            fontWeight: 600,
                                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                        }}>D</div>
                                                    </React.Fragment>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* 圖例說明 */}
                            <div style={{ display: 'flex', gap: '16px', marginTop: '16px', justifyContent: 'center', fontSize: '12px', color: 'var(--slate-500)', fontWeight: 600 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <div style={{ width: '12px', height: '12px', background: 'linear-gradient(90deg, #0ea5e9, #0284c7)', borderRadius: '3px' }}></div> FDG Early
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <div style={{ width: '12px', height: '12px', background: 'linear-gradient(90deg, #14b8a6, #0d9488)', borderRadius: '3px' }}></div> Posluma
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <div style={{ width: '12px', height: '12px', background: 'linear-gradient(90deg, #f97316, #ea580c)', borderRadius: '3px' }}></div> Delayed
                                </div>
                            </div>
                        </div>
                    </React.Fragment>
                );
            })()}

            {/* 列印醫師簽名欄 */}
            <div className="print-only" style={{ background: 'white', padding: '24px 0', marginTop: '16px', borderTop: '2px dashed var(--slate-300)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <p style={{ fontSize: '15px', color: '#000', fontWeight: 600 }}>核閱醫師簽名：__________________</p>
                    <p className="font-mono" style={{ fontSize: '15px', color: '#000', fontWeight: 600 }}>日期：{new Date().toLocaleDateString('zh-TW')}</p>
                </div>
            </div>
        </div>
    );
};
