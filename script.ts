interface UserName {
    title: string;
    first: string;
    last: string;
}

interface UserLocation {
    street: {
        number: number;
        name: string;
    };
    city: string;
    state: string;
    country: string;
    postcode: number | string;
    coordinates: {
        latitude: string;
        longitude: string;
    };
    timezone: {
        offset: string;
        description: string;
    };
}

interface RandomUser {
    gender: string;
    name: UserName;
    location: UserLocation;
    email: string;
    login: {
        uuid: string;
        username: string;
        password: string;
        salt: string;
        md5: string;
        sha1: string;
        sha256: string;
    };
    dob: {
        date: string;
        age: number;
    };
    registered: {
        date: string;
        age: number;
    };
    phone: string;
    cell: string;
    id: {
        name: string;
        value: string;
    };
    picture: {
        large: string;
        medium: string;
        thumbnail: string;
    };
    nat: string;
}

interface ApiResponse {
    results: RandomUser[];
    info: {
        seed: string;
        results: number;
        page: number;
        version: string;
    };
}

type NameDisplayType = 'first' | 'last';

let currentUsers: RandomUser[] = [];
let currentNameDisplay: NameDisplayType = 'first';

document.addEventListener('DOMContentLoaded', () => {
    const userCountInput = document.getElementById('userCount') as HTMLInputElement;
    const nameDisplaySelect = document.getElementById('nameDisplay') as HTMLSelectElement;
    
    const handleKeyPress = (e: KeyboardEvent): void => {
        if (e.key === 'Enter') {
            generateUsers();
        }
    };
    
    const handleNameDisplayChange = (): void => {
        currentNameDisplay = nameDisplaySelect.value as NameDisplayType;
        if (currentUsers.length > 0) {
            displayUsers(currentUsers);
        }
    };
    
    userCountInput.addEventListener('keypress', handleKeyPress);
    nameDisplaySelect.addEventListener('change', handleNameDisplayChange);
    
    generateUsers();
});

const fetchUsers = async (count: number): Promise<RandomUser[]> => {
    const response: Response = await fetch(`https://randomuser.me/api/?results=${count}`);
    
    if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
    }

    const data: ApiResponse = await response.json();
    return data.results;
};

async function generateUsers(): Promise<void> {
    const userCountInput = document.getElementById('userCount') as HTMLInputElement;
    const userCount: number = parseInt(userCountInput.value) || 1;
    
    const isValidCount = (count: number): boolean => count >= 1 && count <= 1000;
    
    if (!isValidCount(userCount)) {
        showError('Please enter a number between 1 and 1000');
        return;
    }

    showLoading();
    hideError();

    try {
        currentUsers = await fetchUsers(userCount);
        displayUsers(currentUsers);
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        showError(`Failed to fetch user data: ${errorMessage}. Please check your internet connection and try again.`);
    } finally {
        hideLoading();
    }
}

const createCell = (content: string): HTMLDivElement => {
    const cell = document.createElement('div');
    cell.className = 'result-cell';
    cell.textContent = content;
    return cell;
};

const getDisplayName = (user: RandomUser): string => {
    const nameMapper = {
        first: () => capitalizeFirst(user.name.first),
        last: () => capitalizeFirst(user.name.last)
    };
    
    return nameMapper[currentNameDisplay]();
};

function displayUsers(users: RandomUser[]): void {
    const usersData = document.getElementById('usersData') as HTMLDivElement;
    usersData.innerHTML = '';

    const userElements = users.flatMap((user: RandomUser) => [
        createCell(getDisplayName(user)),
        createCell(capitalizeFirst(user.gender)),
        createCell(user.email),
        createCell(user.location.country)
    ]);
    
    userElements.forEach((element: any) => usersData.appendChild(element));
}

const showLoading = (): void => {
    const loadingState = document.getElementById('loadingState') as HTMLDivElement;
    loadingState.style.display = 'block';
};

const hideLoading = (): void => {
    const loadingState = document.getElementById('loadingState') as HTMLDivElement;
    loadingState.style.display = 'none';
};

const showError = (message: string): void => {
    const errorDiv = document.getElementById('errorMessage') as HTMLDivElement;
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
};

const hideError = (): void => {
    const errorDiv = document.getElementById('errorMessage') as HTMLDivElement;
    errorDiv.style.display = 'none';
};

const capitalizeFirst = (str: string): string => 
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
