import React, { useState} from 'react';
import { usePendingCrews } from './hooks/usePendingCrews';
import PendingCrewGrid from './components/PendingCrewGrid';
import InsertCrewView from './InsertCrewView';
import './Admin.css';

function ApproveCrewsView({adminSecret}) {
    const {crews, loading, fetchPendingCrews, deletePendingEntry, removeCrewFromList} = usePendingCrews(adminSecret);
    const [selectedCrew, setSelectedCrew] = useState(null);
    
    //Καλειται απο το InsertCrewView μολις τελειωσει η δουλεια (ειτε approve είτε reject)
    const handleProcessComplete = async (newCrewId) => {
        //Αν newCrewId υπαρχει, σημαινει εγινε Approve και πρεπει να σβησουμε το pending crew
        if(newCrewId && selectedCrew){
            await deletePendingEntry(selectedCrew.id);
        } else{
            //Αν ειναι null, σημαινει οτι εγινε reject ή απλα πάτησε Cancel/Back. Αν εγινε reject, το InsertCrewView εχει 
            // ηδη καλεσει το API, οποτε το βγαζουμε απο τη λιστα τοπικα.
            if(selectedCrew) removeCrewFromList(selectedCrew.id);
        }
        setSelectedCrew(null);
    };

    //Αν εχουμε επιλέξει το crew, δειχνουμε τον Editor.
    if(selectedCrew){
        return(
            <InsertCrewView  
                adminSecret={adminSecret}
                prefilledData={selectedCrew}
                onCancel={()=> setSelectedCrew(null)}
                onApproveSuccess={handleProcessComplete}
            />
        );
    }

    //Αλλιως δειχνουμε τη λιστα
    return(
        <PendingCrewGrid
            crews={crews}
            loading={loading}
            onSelect={setSelectedCrew}
            onRefresh={fetchPendingCrews}
        />
       
    );
}

export default ApproveCrewsView;