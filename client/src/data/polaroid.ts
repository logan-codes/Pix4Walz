interface Polaroid {
    id: string;
    url: string;
    caption: string;
    rotation: number;
}

export const polaroids: Polaroid[] = [
    {
        id: 'polaroid-1',
        url: 'https://imgs.search.brave.com/4KvQP15_f1w3q93SM6ElYLQjtaU7Erf-9S5b-LRk3IE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by9i/ZWF1dGlmdWwtc3Vu/c2V0LW1vdW50YWlu/cy1sYW5kc2NhcGUt/d2l0aC1zdW4tbGln/aHQtc2hpbmluZy10/aHJvdWdoLW9yYW5n/ZS1jbG91ZHMtZm9n/XzE0NjY3MS0xODQ3/Ni5qcGc_c2VtdD1h/aXNfaHlicmlkJnc9/NzQw',
        caption: 'A beautiful sunset over the mountains',
        rotation: 0,
    },
    {
        id: 'polaroid-2',
        url: 'https://imgs.search.brave.com/S68BVPnk4FOSs-_h98P_oUz-8CuaPnvUmyYZozRZ7qM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wcmV2/aWV3LnJlZGQuaXQv/NjFnMGJoemtteXp6/LmpwZz93aWR0aD02/NDAmY3JvcD1zbWFy/dCZhdXRvPXdlYnAm/cz0yNjU4YWQ3YTIw/N2ExNGZiMzJlMGU0/YzE1MjRjY2ZlYjM0/NWY5NDEw',
        caption: 'A cozy cabin in the woods',
        rotation: 5,
    },
    { 
        id: 'polaroid-3', 
        url: 'https://imgs.search.brave.com/VyJR5HZ3Kp9gsfc9Ss3aWG04ZcKdNrVxAHm25bfpsRg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvNTA5/NDg4MTc2L3Bob3Rv/L3BhcmFkaXNlLWJl/YWNoLmpwZz9zPTYx/Mng2MTImdz0wJms9/MjAmYz16b2lqWG5a/NUJxYXNhaUExTnJo/U3AzNG13WEloX0c5/MGFZbEt3dUQ0Qmgw/PQ', 
        caption: 'Beach Day', 
        rotation: -5 },
    
]