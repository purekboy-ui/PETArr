// ============ 主應用程式 ============
const App = () => {
    const [patientCount, setPatientCount] = useState(5);
    const [config, setConfig] = useState(DEFAULT_CONFIG);
    const [activeTab, setActiveTab] = useState('planner');
    const [poslumaExpanded, setPoslumaExpanded] = useState(false);

    const result = useMemo(() => calculateSchedule(patientCount, config), [patientCount, config]);

    const handlePrint = () => window.print();

    const handleConfigChange = (key, value) => {
        setConfig(prev => ({ ...prev, [key]: value }));
        if (key === 'poslumaCount' && value > 0) {
            setPoslumaExpanded(true);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* 頂部導航 */}
            <header className="no-print" style={{
                background: 'white',
                borderBottom: '1px solid var(--slate-200)',
                padding: '16px 0',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
            }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            background: 'var(--teal-50)',
                            color: 'var(--teal-600)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '24px',
                            border: '1px solid var(--teal-100)'
                        }}>
                            <i className="fa-solid fa-notes-medical"></i>
                        </div>
                        <div>
                            <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: 'var(--slate-800)', letterSpacing: '-0.02em' }}>
                                PET 智慧排程助手
                            </h1>
                            <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: 'var(--slate-500)' }}>Smart PET Scheduler · 高階醫療版</p>
                        </div>
                    </div>

                    <button onClick={handlePrint} className="btn-soft" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 20px',
                        background: 'white',
                        border: '1px solid var(--slate-300)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: 'var(--slate-700)',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                    }}>
                        <i className="fa-solid fa-print" style={{ color: 'var(--slate-500)' }}></i> 列印報表
                    </button>
                </div>
            </header>

            <main className="app-container" style={{ flex: 1 }}>
                {/* 左側：參數輸入區 (Left Pane) */}
                <div className="no-print left-pane">
                    <div className="card" style={{ padding: '24px' }}>
                        <h2 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: 700, color: 'var(--slate-800)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <i className="fa-solid fa-sliders" style={{ color: 'var(--slate-400)' }}></i>
                            排程參數設定
                        </h2>

                        {/* 預設按鈕區 */}
                        <div style={{ marginBottom: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            <button
                                onClick={() => {
                                    setPatientCount(DR_HUANG_PRESET.patientCount);
                                    setConfig(prev => ({
                                        ...prev,
                                        startTime: DR_HUANG_PRESET.startTime,
                                        earlyScanDuration: DR_HUANG_PRESET.earlyScanDuration,
                                        delayedScanDuration: DR_HUANG_PRESET.delayedScanDuration,
                                        uptakeTime: DR_HUANG_PRESET.uptakeTime,
                                        minWaitLimit: DR_HUANG_PRESET.minWaitLimit,
                                        maxWaitLimit: DR_HUANG_PRESET.maxWaitLimit,
                                    }));
                                }}
                                className="btn-soft"
                                style={{
                                    flex: 1,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '10px',
                                    background: 'var(--slate-800)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}
                            >
                                <i className="fa-solid fa-user-doctor"></i>
                                Dr. Huang 預設
                            </button>
                            <button
                                onClick={() => {
                                    setPatientCount(5);
                                    setConfig(DEFAULT_CONFIG);
                                }}
                                className="btn-soft"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    padding: '10px 16px',
                                    background: 'white',
                                    color: 'var(--slate-600)',
                                    border: '1px solid var(--slate-300)',
                                    borderRadius: '8px',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}
                                title="回復系統預設值"
                            >
                                <i className="fa-solid fa-rotate-left"></i>
                            </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '20px' }}>
                            {/* FDG 病人數量 */}
                            <div style={{ paddingBottom: '16px', borderBottom: '1px solid var(--slate-100)' }}>
                                <label style={{ display: 'flex', alignItems: 'center', fontSize: '14px', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '12px' }}>
                                    <span style={{ background: 'var(--slate-100)', color: 'var(--slate-600)', padding: '2px 8px', borderRadius: '4px', marginRight: '8px', fontSize: '11px', border: '1px solid var(--slate-200)' }}>FDG</span>
                                    病人總數
                                </label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <button onClick={() => setPatientCount(Math.max(0, patientCount - 1))} className="btn-soft" style={{
                                        width: '36px', height: '36px', borderRadius: '8px',
                                        background: 'var(--slate-100)', border: '1px solid var(--slate-200)', cursor: 'pointer',
                                        fontSize: '18px', color: 'var(--slate-600)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>−</button>
                                    <input
                                        type="number"
                                        value={patientCount}
                                        onChange={(e) => setPatientCount(e.target.value === '' ? 0 : parseInt(e.target.value))}
                                        onBlur={(e) => setPatientCount(Math.max(0, parseInt(e.target.value) || 0))}
                                        className="input-soft patient-count-input"
                                        style={{ flex: 1, height: '36px' }}
                                    />
                                    <button onClick={() => setPatientCount(patientCount + 1)} className="btn-soft" style={{
                                        width: '36px', height: '36px', borderRadius: '8px',
                                        background: 'var(--slate-100)', border: '1px solid var(--slate-200)', cursor: 'pointer',
                                        fontSize: '18px', color: 'var(--slate-600)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>+</button>
                                </div>
                            </div>

                            {/* 基本時間參數排列 */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--slate-600)', marginBottom: '8px' }}>首針打藥時間</label>
                                    <input
                                        type="time"
                                        value={config.startTime}
                                        onChange={(e) => handleConfigChange('startTime', e.target.value)}
                                        className="input-soft"
                                        style={{ width: '100%' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--slate-600)', marginBottom: '8px' }}>Uptake (分鐘)</label>
                                    <input
                                        type="number"
                                        value={config.uptakeTime}
                                        onChange={(e) => handleConfigChange('uptakeTime', e.target.value === '' ? '' : parseInt(e.target.value))}
                                        onBlur={(e) => handleConfigChange('uptakeTime', Math.max(1, parseInt(e.target.value) || 60))}
                                        className="input-soft"
                                        style={{ width: '100%' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--slate-600)', marginBottom: '8px' }}>Early Scan</label>
                                    <input
                                        type="number"
                                        value={config.earlyScanDuration}
                                        onChange={(e) => handleConfigChange('earlyScanDuration', e.target.value === '' ? '' : parseInt(e.target.value))}
                                        onBlur={(e) => handleConfigChange('earlyScanDuration', Math.max(1, parseInt(e.target.value) || 35))}
                                        className="input-soft"
                                        style={{ width: '100%' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--slate-600)', marginBottom: '8px' }}>Delayed <span style={{ fontWeight: 400, color: 'var(--slate-400)' }}>(0=無)</span></label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={config.delayedScanDuration}
                                        onChange={(e) => handleConfigChange('delayedScanDuration', e.target.value === '' ? '' : parseInt(e.target.value))}
                                        onBlur={(e) => handleConfigChange('delayedScanDuration', Math.max(0, parseInt(e.target.value) || 0))}
                                        className="input-soft"
                                        style={{ width: '100%' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, color: 'var(--slate-600)', marginBottom: '8px' }}>
                                        <span>容許等待下限</span>
                                    </label>
                                    <input
                                        type="number"
                                        min="90"
                                        max="240"
                                        value={config.minWaitLimit}
                                        onChange={(e) => handleConfigChange('minWaitLimit', e.target.value === '' ? '' : parseInt(e.target.value))}
                                        onBlur={(e) => handleConfigChange('minWaitLimit', Math.max(90, Math.min(240, parseInt(e.target.value) || 90)))}
                                        className="input-soft"
                                        style={{ width: '100%' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, color: 'var(--slate-600)', marginBottom: '8px' }}>
                                        <span>容許等待上限</span>
                                    </label>
                                    <input
                                        type="number"
                                        min="90"
                                        max="240"
                                        value={config.maxWaitLimit}
                                        onChange={(e) => handleConfigChange('maxWaitLimit', e.target.value === '' ? '' : parseInt(e.target.value))}
                                        onBlur={(e) => handleConfigChange('maxWaitLimit', Math.max(90, Math.min(240, parseInt(e.target.value) || 240)))}
                                        className="input-soft"
                                        style={{ width: '100%' }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 午休時間設定 */}
                        <div style={{
                            marginTop: '24px',
                            padding: '16px',
                            background: 'var(--slate-50)',
                            borderRadius: '8px',
                            border: '1px solid var(--slate-200)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: config.lunchBreakEnabled ? '16px' : '0' }}>
                                <label style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    cursor: 'pointer',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    color: 'var(--slate-700)'
                                }}>
                                    <input
                                        type="checkbox"
                                        checked={config.lunchBreakEnabled}
                                        onChange={(e) => handleConfigChange('lunchBreakEnabled', e.target.checked)}
                                        style={{ width: '16px', height: '16px', accentColor: 'var(--teal-600)' }}
                                    />
                                    設備中午暫停掃描
                                </label>
                            </div>

                            {config.lunchBreakEnabled && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                                    <input
                                        type="time"
                                        value={config.lunchBreakStart}
                                        onChange={(e) => handleConfigChange('lunchBreakStart', e.target.value)}
                                        className="input-soft"
                                        style={{ width: '45%' }}
                                    />
                                    <span style={{ color: 'var(--slate-400)' }}>-</span>
                                    <input
                                        type="time"
                                        value={config.lunchBreakEnd}
                                        onChange={(e) => handleConfigChange('lunchBreakEnd', e.target.value)}
                                        className="input-soft"
                                        style={{ width: '45%' }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Posluma PET 設定 - 可折疊 */}
                        <div style={{
                            marginTop: '24px',
                            background: 'white',
                            borderRadius: '8px',
                            border: '1px solid var(--teal-200)',
                            overflow: 'hidden'
                        }}>
                            <div
                                onClick={() => setPoslumaExpanded(!poslumaExpanded)}
                                style={{
                                    padding: '12px 16px',
                                    background: 'var(--teal-50)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    cursor: 'pointer',
                                    userSelect: 'none'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{
                                        background: 'var(--teal-600)',
                                        color: 'white',
                                        padding: '2px 8px',
                                        borderRadius: '4px',
                                        fontSize: '11px',
                                        fontWeight: 700
                                    }}>Posluma</span>
                                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--teal-700)' }}>PSMA 專案檢查設定</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {config.poslumaCount > 0 && (
                                        <span className="font-mono" style={{
                                            background: 'white',
                                            color: 'var(--teal-700)',
                                            border: '1px solid var(--teal-200)',
                                            padding: '2px 8px',
                                            borderRadius: '12px',
                                            fontSize: '11px',
                                            fontWeight: 600
                                        }}>{config.poslumaCount} 位</span>
                                    )}
                                    <i className={`fa-solid fa-chevron-${poslumaExpanded ? 'up' : 'down'}`}
                                        style={{ color: 'var(--teal-600)', fontSize: '12px', transition: 'transform 0.2s' }}></i>
                                </div>
                            </div>

                            <div style={{
                                maxHeight: poslumaExpanded ? '600px' : '0',
                                overflow: 'hidden',
                                transition: 'max-height 0.3s ease-in-out',
                                padding: poslumaExpanded ? '16px' : '0 16px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', borderBottom: '1px solid var(--slate-100)', paddingBottom: '16px' }}>
                                    <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--slate-700)', flex: 1 }}>Posluma 總量</label>
                                    <button onClick={() => handleConfigChange('poslumaCount', Math.max(0, config.poslumaCount - 1))} className="btn-soft" style={{
                                        width: '32px', height: '32px', borderRadius: '6px',
                                        background: 'var(--teal-50)', border: '1px solid var(--teal-100)', cursor: 'pointer',
                                        fontSize: '16px', color: 'var(--teal-600)'
                                    }}>−</button>
                                    <input
                                        type="number"
                                        value={config.poslumaCount}
                                        onChange={(e) => handleConfigChange('poslumaCount', e.target.value === '' ? 0 : parseInt(e.target.value))}
                                        onBlur={(e) => handleConfigChange('poslumaCount', Math.max(0, parseInt(e.target.value) || 0))}
                                        className="input-soft font-mono"
                                        style={{ width: '56px', textAlign: 'center' }}
                                    />
                                    <button onClick={() => handleConfigChange('poslumaCount', config.poslumaCount + 1)} className="btn-soft" style={{
                                        width: '32px', height: '32px', borderRadius: '6px',
                                        background: 'var(--teal-50)', border: '1px solid var(--teal-100)', cursor: 'pointer',
                                        fontSize: '16px', color: 'var(--teal-600)'
                                    }}>+</button>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '12px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--slate-500)', marginBottom: '6px' }}>Early Scan (min)</label>
                                        <input
                                            type="number"
                                            value={config.poslumaEarlyScan}
                                            onChange={(e) => handleConfigChange('poslumaEarlyScan', e.target.value === '' ? '' : parseInt(e.target.value))}
                                            onBlur={(e) => handleConfigChange('poslumaEarlyScan', Math.max(1, parseInt(e.target.value) || 20))}
                                            className="input-soft"
                                            style={{ width: '100%' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--slate-500)', marginBottom: '6px' }}>Delayed (0=無)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={config.poslumaDelayedScan}
                                            onChange={(e) => handleConfigChange('poslumaDelayedScan', e.target.value === '' ? '' : parseInt(e.target.value))}
                                            onBlur={(e) => handleConfigChange('poslumaDelayedScan', Math.max(0, parseInt(e.target.value) || 0))}
                                            className="input-soft"
                                            style={{ width: '100%' }}
                                        />
                                    </div>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--slate-500)', marginBottom: '6px' }}>Uptake (min)</label>
                                        <input
                                            type="number"
                                            value={config.poslumaUptakeTime}
                                            onChange={(e) => handleConfigChange('poslumaUptakeTime', e.target.value === '' ? '' : parseInt(e.target.value))}
                                            onBlur={(e) => handleConfigChange('poslumaUptakeTime', Math.max(1, parseInt(e.target.value) || 60))}
                                            className="input-soft"
                                            style={{ width: '100%' }}
                                        />
                                    </div>
                                </div>

                                {config.poslumaCount > 0 && (
                                    <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px dashed var(--teal-200)' }}>
                                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--teal-700)', marginBottom: '10px' }}>
                                            <i className="fa-solid fa-syringe" style={{ marginRight: '6px' }}></i>
                                            強制指定打藥時間
                                        </label>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            {Array.from({ length: config.poslumaCount }, (_, i) => (
                                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <span className="font-mono" style={{ fontSize: '12px', color: 'var(--slate-500)', width: '20px' }}>P{i + 1}</span>
                                                    <input
                                                        type="time"
                                                        value={config.poslumaInjectionTimes[i] || '14:00'}
                                                        onChange={(e) => {
                                                            const newTimes = [...config.poslumaInjectionTimes];
                                                            newTimes[i] = e.target.value;
                                                            handleConfigChange('poslumaInjectionTimes', newTimes);
                                                        }}
                                                        className="input-soft"
                                                        style={{ flex: 1 }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <p style={{ marginTop: '16px', textAlign: 'center', fontSize: '12px', color: 'var(--slate-400)' }}>
                        參數修改會即時反映至右側報表
                    </p>
                </div>

                {/* 右側：排程預覽區 (Right Pane) */}
                <div className="right-pane">
                    {/* 模式狀態列 */}
                    {(patientCount > 0 || config.poslumaCount > 0) && (
                        <div className="card no-print" style={{
                            marginBottom: '20px',
                            padding: '16px 20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '12px',
                            borderLeft: '4px solid ' + (
                                result.mode === 'BATCH' ? '#10b981' :
                                    result.mode === 'AUTO_INTERLEAVED' ? '#3b82f6' :
                                        result.mode === 'EARLY_ONLY' ? '#f59e0b' :
                                            result.mode === 'MIXED' ? '#0f766e' :
                                                result.mode === 'POSLUMA_ONLY' ? '#14b8a6' :
                                                    result.mode === 'ERROR' ? '#ef4444' : 'var(--slate-300)'
                            )
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                                <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--slate-800)' }}>
                                    {result.mode === 'BATCH' && '✔️ 批次處理模式'}
                                    {result.mode === 'AUTO_INTERLEAVED' && '⚡ 自動插單優化'}
                                    {result.mode === 'EARLY_ONLY' && '單次掃描模式'}
                                    {result.mode === 'MIXED' && '多藥物混合排程'}
                                    {result.mode === 'POSLUMA_ONLY' && '獨立 PSMA 排程'}
                                    {result.mode === 'ERROR' && '❌ 參數錯誤'}
                                </span>
                                {result.mode !== 'ERROR' && (
                                    <span style={{ fontSize: '13px', color: 'var(--slate-500)', borderLeft: '1px solid var(--slate-200)', paddingLeft: '12px' }}>
                                        {result.summary}
                                    </span>
                                )}
                                {result.mode === 'ERROR' && (
                                    <span style={{ fontSize: '13px', color: '#ef4444', borderLeft: '1px solid #fee2e2', paddingLeft: '12px' }}>
                                        {result.error}
                                    </span>
                                )}
                            </div>

                            {result.mode !== 'ERROR' && (
                                <div className="font-mono" style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px' }}>
                                    {result.maxPatientWaitTime && (
                                        <div style={{ color: 'var(--slate-500)' }}>
                                            最長等候: <span style={{ fontWeight: 700, color: 'var(--slate-800)' }}>
                                                {Math.floor(result.maxPatientWaitTime / 60)}h {result.maxPatientWaitTime % 60}m
                                            </span>
                                        </div>
                                    )}
                                    {result.machineIdleTime !== undefined && (
                                        <div style={{ color: 'var(--slate-500)' }}>
                                            總機台閒置: <span style={{ fontWeight: 700, color: result.machineIdleTime > 0 ? 'var(--orange-600)' : 'var(--slate-800)' }}>
                                                {result.machineIdleTime} min
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Posluma 時間衝突警告 */}
                    {result.poslumaWarnings && result.poslumaWarnings.length > 0 && (
                        <div className="card no-print" style={{
                            marginBottom: '20px', padding: '16px', border: '1px solid var(--orange-200)', background: 'var(--orange-50)'
                        }}>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: '16px', color: 'var(--orange-500)', marginTop: '2px' }}></i>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 700, color: 'var(--orange-600)', marginBottom: '12px', fontSize: '14px' }}>排程時間衝突建議</div>
                                    {result.poslumaWarnings.map((w, idx) => (
                                        <div key={idx} style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                            background: 'white', padding: '10px 12px', borderRadius: '6px', marginBottom: '8px', border: '1px solid var(--orange-100)'
                                        }}>
                                            <div style={{ fontSize: '13px', color: 'var(--slate-700)' }}>
                                                <strong className="font-mono">P{w.patientIndex + 1}</strong>: 設定 {w.originalTime} 上機時段已被佔用
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <span style={{ fontSize: '12px', color: 'var(--slate-400)' }}>系統找出的最佳空檔</span>
                                                <span className="font-mono" style={{ background: 'var(--teal-50)', color: 'var(--teal-700)', padding: '2px 6px', borderRadius: '4px', fontWeight: 600, fontSize: '13px' }}>
                                                    {w.suggestedTime}
                                                </span>
                                                <button
                                                    onClick={() => {
                                                        const newTimes = [...config.poslumaInjectionTimes];
                                                        newTimes[w.patientIndex] = w.suggestedValue;
                                                        handleConfigChange('poslumaInjectionTimes', newTimes);
                                                    }}
                                                    className="btn-soft"
                                                    style={{
                                                        background: 'var(--orange-500)', color: 'white', border: 'none', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 600, cursor: 'pointer'
                                                    }}
                                                >
                                                    採用建議
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tab 頁籤 */}
                    <div className="no-print" style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                        <button
                            onClick={() => setActiveTab('planner')}
                            className="btn-soft"
                            style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '10px 20px', borderRadius: '8px', border: '1px solid',
                                cursor: 'pointer', fontSize: '14px', fontWeight: 600,
                                borderColor: activeTab === 'planner' ? 'var(--navy-200)' : 'transparent',
                                background: activeTab === 'planner' ? 'white' : 'transparent',
                                color: activeTab === 'planner' ? 'var(--navy-600)' : 'var(--slate-500)',
                                boxShadow: activeTab === 'planner' ? '0 1px 3px rgba(0,0,0,0.05)' : 'none'
                            }}
                        >
                            <i className="fa-solid fa-syringe" style={{ color: activeTab === 'planner' ? 'var(--navy-500)' : 'inherit' }}></i>
                            注射時刻表 (醫師視角)
                        </button>
                        <button
                            onClick={() => setActiveTab('worklist')}
                            className="btn-soft"
                            style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '10px 20px', borderRadius: '8px', border: '1px solid',
                                cursor: 'pointer', fontSize: '14px', fontWeight: 600,
                                borderColor: activeTab === 'worklist' ? 'var(--teal-200)' : 'transparent',
                                background: activeTab === 'worklist' ? 'white' : 'transparent',
                                color: activeTab === 'worklist' ? 'var(--teal-700)' : 'var(--slate-500)',
                                boxShadow: activeTab === 'worklist' ? '0 1px 3px rgba(0,0,0,0.05)' : 'none'
                            }}
                        >
                            <i className="fa-solid fa-list-check" style={{ color: activeTab === 'worklist' ? 'var(--teal-500)' : 'inherit' }}></i>
                            攝影順序表 (實體打勾版)
                        </button>
                    </div>

                    {/* Tab 內容實體化 */}
                    {activeTab === 'planner' ? (
                        <PlannerTab schedule={result.schedule} result={result} config={config} />
                    ) : (
                        <WorklistTab schedule={result.schedule} result={result} />
                    )}
                </div>
            </main>

            {/* 頁腳 */}
            <footer className="no-print" style={{
                marginTop: '48px',
                padding: '24px 20px',
                textAlign: 'center',
                fontSize: '12px',
                color: 'var(--slate-400)',
                borderTop: '1px solid var(--slate-200)'
            }}>
                PET 智慧排程助手 (Premium Print Edition) | 僅供參考，實際操作請依臨床實務判斷
            </footer>
        </div>
    );
};
