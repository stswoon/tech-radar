interface HeaderProps {
    configType: 'dev' | 'sa';
    setConfigType: (type: 'dev' | 'sa') => void;
}

export const Header: React.FC<HeaderProps> = ({ configType, setConfigType }) => {
    return (
        <header style={{ marginBottom: 4, display: 'flex', gap: 4 }}>
            <button
                onClick={() => setConfigType('dev')}
                disabled={configType === 'dev'}
            >
                Dev Radar
            </button>
            <button
                onClick={() => setConfigType('sa')}
                disabled={configType === 'sa'}
            >
                SA Radar
            </button>
        </header>
    );
};