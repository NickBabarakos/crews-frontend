import React  from 'react';
import { useReportsManager } from './hooks/useReportsManager';
import ReportList from './components/ReportList';
import ReportDetails from './components/ReportDetails';


function ManageReportsView({adminSecret}) {

    const{
        reports,
        selectedReport,
        setSelectedReport,
        loading,
        resolveReport,
        refreshReports,
    } = useReportsManager(adminSecret);
   

    if(selectedReport){
        return(
            <ReportDetails
                report={selectedReport}
                onCancel={()=> setSelectedReport(null)}
                onResolve={resolveReport}
            />
        );
    }

    return(
        <ReportList
            reports={reports}
            loading={loading}
            onSelect={setSelectedReport}
            onRefresh={refreshReports}
        />
    );
}

export default ManageReportsView;