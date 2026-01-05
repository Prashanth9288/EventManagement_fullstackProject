const fs = require('fs');
const path = require('path');
const root = 'c:\\Users\\prashanth\\Desktop\\Event_management\\EventManagement_fullstackProject\\Frontend\\src';

console.log('Starting cleanup...');

// 1. Delete compoenets
try {
    const compoenets = path.join(root, 'compoenets');
    if (fs.existsSync(compoenets)) {
        fs.rmSync(compoenets, { recursive: true, force: true });
        console.log('Deleted compoenets');
    } else {
        console.log('compoenets not found');
    }
} catch (e) { console.error('Error deleting compoenets:', e.message); }

// 2. Delete Pages/CreateEventWizard
try {
    const wizardDir = path.join(root, 'Pages', 'CreateEventWizard');
    if (fs.existsSync(wizardDir)) {
        fs.rmSync(wizardDir, { recursive: true, force: true });
        console.log('Deleted Pages/CreateEventWizard');
    } else {
        console.log('Pages/CreateEventWizard not found');
    }
} catch (e) { console.error('Error deleting wizard:', e.message); }

// 3. Delete root pages
const pages = [
    'AttendeeDashboard.jsx', 
    'Contact.jsx', 
    'CreateEvent.jsx', 
    'Dashboard.jsx', 
    'EventDetails.jsx', 
    'Features.jsx', 
    'Home.jsx', 
    'Login.jsx', 
    'MyEvents.jsx', 
    'NetworkingHub.jsx', 
    'OrganizerDashboard.jsx', 
    'RSVPDashboard.jsx', 
    'Signup.jsx', 
    'VirtualLobby.jsx'
];

pages.forEach(f => {
    try {
        const filePath = path.join(root, 'Pages', f);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log('Deleted ' + f);
        } else {
             // console.log(f + ' not found');
        }
    } catch (e) { console.error('Failed to delete ' + f + ': ' + e.message); }
});

console.log('Cleanup complete.');
