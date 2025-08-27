"use strict";
let currentUsers = [];
let currentNameDisplay = 'first';
document.addEventListener('DOMContentLoaded', () => {
    const userCountInput = document.getElementById('userCount');
    const nameDisplaySelect = document.getElementById('nameDisplay');
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            generateUsers();
        }
    };
    const handleNameDisplayChange = () => {
        currentNameDisplay = nameDisplaySelect.value;
        if (currentUsers.length > 0) {
            displayUsers(currentUsers);
        }
    };
    userCountInput.addEventListener('keypress', handleKeyPress);
    nameDisplaySelect.addEventListener('change', handleNameDisplayChange);
    generateUsers();
});
const fetchUsers = async (count) => {
    const response = await fetch(`https://randomuser.me/api/?results=${count}`);
    if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
    }
    const data = await response.json();
    return data.results;
};
async function generateUsers() {
    const userCountInput = document.getElementById('userCount');
    const userCount = parseInt(userCountInput.value) || 1;
    const isValidCount = (count) => count >= 1 && count <= 1000;
    if (!isValidCount(userCount)) {
        showError('Please enter a number between 1 and 1000');
        return;
    }
    showLoading();
    hideError();
    try {
        currentUsers = await fetchUsers(userCount);
        displayUsers(currentUsers);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        showError(`Failed to fetch user data: ${errorMessage}. Please check your internet connection and try again.`);
    }
    finally {
        hideLoading();
    }
}
const createCell = (content) => {
    const cell = document.createElement('div');
    cell.className = 'result-cell';
    cell.textContent = content;
    return cell;
};
const getDisplayName = (user) => {
    const nameMapper = {
        first: () => capitalizeFirst(user.name.first),
        last: () => capitalizeFirst(user.name.last)
    };
    return nameMapper[currentNameDisplay]();
};
function displayUsers(users) {
    const usersData = document.getElementById('usersData');
    usersData.innerHTML = '';
    const userElements = users.flatMap((user) => [
        createCell(getDisplayName(user)),
        createCell(capitalizeFirst(user.gender)),
        createCell(user.email),
        createCell(user.location.country)
    ]);
    userElements.forEach((element) => usersData.appendChild(element));
}
const showLoading = () => {
    const loadingState = document.getElementById('loadingState');
    loadingState.style.display = 'block';
};
const hideLoading = () => {
    const loadingState = document.getElementById('loadingState');
    loadingState.style.display = 'none';
};
const showError = (message) => {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
};
const hideError = () => {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.style.display = 'none';
};
const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
