const prices = {
    inclusive: {
        '1x1': 2185,
        '2x2 Standard': 1550,
        '2x2 Master': 1600,
        '3x3 Standard': 1285,
        '3x3 Master': 1345,
        '4x4 Standard': 1175,
        '4x4 Master': 1235,
        'Studio Standard': 1475,
        'Studio Deluxe': 1550,
        'Studio Master': 1605
    },
    nonInclusive: {
        '1x1': 1985,
        '2x2 Standard': 1350,
        '2x2 Master': 1400,
        '3x3 Standard': 1085,
        '3x3 Master': 1145,
        '3x3 Deluxe Standard': 1275,
        '3x3 Deluxe Master': 1335,
        '4x4 Standard': 975,
        '4x4 Master': 1035,
        'Studio Standard': 1275,
        'Studio Deluxe': 1350,
        'Studio Master': 1405,
    },
    
    adminFee: 349,
    parkingFee: 35,
    furnitureFee: 60,
    petFee: 50,
    oneTimePetFee: 300,
    shortTermLeaseFee: 150,

}

function updateFloorplanOptions() {
    const isStudent = document.getElementById('student_yes').checked;
    const floorplanDeluxeContainer = document.getElementById('floorplan_3x3_deluxe_container');

    if (!isStudent) {
        floorplanDeluxeContainer.style.display = 'inline';
    } else {
        floorplanDeluxeContainer.style.display = 'none';
    }
}

function getSelectedFloorplan() {
    const prices = document.getElementsByName('floorplan');
    let selectedFloorplan;
    for (const floorplan of prices) {
        if (floorplan.checked) {
            selectedFloorplan = floorplan.value;
            break;
        }
    }
    return selectedFloorplan;
}

function getBaseRent(floorplanCategory, baseRentType) {
    let standardFloorplan;
    if (baseRentType === '1x1') {
        standardFloorplan = baseRentType;
    } else if (baseRentType.includes('Studio')) {
        standardFloorplan = 'Studio Standard';
    } else if (baseRentType.includes('3x3 Deluxe')) {
        standardFloorplan = '3x3 Deluxe Standard';
    } else {
        standardFloorplan = baseRentType.replace(' Master', '').replace(' Deluxe', '') + ' Standard';
    }
    const baseRent = floorplanCategory[standardFloorplan];
    return baseRent;
}

function getBedroomUpgrade(rent, baseRent) {
    const bedroomUpgrade = rent - baseRent;
    const bedroomUpgradeText = bedroomUpgrade > 0 ? `$${bedroomUpgrade.toFixed(2)}` : 'N/A';
    return bedroomUpgradeText;
}

function updateBedSizeOptions() {
    const isStudent = document.getElementById('student_yes').checked;
    const floorplan = document.querySelector('input[name="floorplan"]:checked').value;
    const bedSizeContainer = document.getElementById('bed_size_container');
    const bedSizeDiv = document.getElementById('bed_size');

    let options = [];

    if (floorplan === '1x1') {
        bedSizeContainer.style.display = 'none';
        return;
    } else {
        bedSizeContainer.style.display = 'block';
    }

    if (floorplan.includes('Studio')) {
        options = ['Standard', 'Deluxe', 'Master'];
    } else {
        options = ['Standard', 'Master'];
    }
    
    

    bedSizeDiv.innerHTML = '';

    options.forEach((option, index) => {
        const radioButton = document.createElement('input');
        radioButton.type = 'radio';
        radioButton.name = 'bed_size';
        radioButton.id = `bed_size_${index}`;
        radioButton.value = option;
        radioButton.checked = index === 0;
        radioButton.addEventListener('change', calculateRent);
        

        const label = document.createElement('label');
        label.setAttribute('for', `bed_size_${index}`);
        label.textContent = option;

        bedSizeDiv.appendChild(radioButton);
        bedSizeDiv.appendChild(label);
        radioButton.addEventListener('change', calculateRent);

        radioButton.classList.add('custom-radio'); // CSS radio button style

    });
    calculateRent();

}

function calculateBaseRent(isStudent, floorplan) {
    const floorplanCategory = isStudent ? prices.inclusive : prices.nonInclusive;
    const baseRentType = floorplan.replace(' Master', '').replace(' Deluxe', '');
    let baseRent = getBaseRent(floorplanCategory, baseRentType);

    // Fix base rent for 3x3 Deluxe Master
    if (floorplan === '3x3 Deluxe Master') {
        baseRent = floorplanCategory['3x3 Deluxe Standard'];
    } else if (floorplan.endsWith(' Standard')) {
        baseRent = floorplanCategory[floorplan];
    }

    return baseRent;
}

// Bedroom Upgrade
function calculateBedroomUpgrade(isStudent, floorplan, baseRent) {
    const floorplanCategory = isStudent ? prices.inclusive : prices.nonInclusive;
    const rent = floorplanCategory[floorplan];
    const bedroomUpgradeText = getBedroomUpgrade(rent, baseRent);
    return bedroomUpgradeText;
}

// Admin fee
function calculateAdminFee(isStudent) {
    return isStudent ? 'Included' : `$${prices.adminFee.toFixed(2)}`;
}

// Security Deposit
function calculateSecurityDeposit(isIncomeThreeTimesBaseRent, baseRent) {
    const customSecurityDepositInput = document.getElementById("custom_security_deposit");
    const customSecurityDeposit = parseFloat(customSecurityDepositInput.value);

    if (!isNaN(customSecurityDeposit) && customSecurityDeposit > 0) {
        return customSecurityDeposit;
    } else {
        return isIncomeThreeTimesBaseRent ? baseRent : baseRent * 2;
    }
}


function resetCustomSecurityDepositInput() {
    const customSecurityDepositInput = document.getElementById("custom_security_deposit");
    customSecurityDepositInput.value = "";
}



// Parking Fee
function calculateParkingFee(isStudent, hasCar) {
    if (isStudent) {
        return "Included";
    } else {
        return hasCar ? `$${prices.parkingFee.toFixed(2)}` : "N/A";
    }
}

function calculateOneTimePetFee(hasPet) {
    return hasPet ? `$${prices.oneTimePetFee.toFixed(2)}` : "N/A";
}

// Furniture Fee
function calculateFurnitureFee(isStudent, isFurnished) {
    if (isStudent) {
        return "Included";
    } else {
        return isFurnished ? `$${prices.furnitureFee.toFixed(2)}` : "N/A";
    }
}

// Pet Fee
function calculatePetFee(hasPet, isESA) {
    if (hasPet) {
        return isESA ? "ESA" : `$${prices.petFee.toFixed(2)}`;
    } else if (isESA) {
        return "ESA";
    } else {
        return "N/A";
    }
}

// Short Term Fee
function calculateShortTermLeaseFee(isShortTermLease) {
    return isShortTermLease ? `$${prices.shortTermLeaseFee.toFixed(2)}` : 'N/A';
}

// Utilities Fe
function displayUtilities() {
    const studentYes = document.getElementById("student_yes");
    const utilitiesElement = document.getElementById("utilities");

    if (studentYes.checked) {
        utilitiesElement.textContent = "Included";
    } else {
        utilitiesElement.textContent = "Depends on usage";
    }
}


function calculateTotalRent(isStudent, floorplan) {
    const floorplanCategory = isStudent ? prices.inclusive : prices.nonInclusive;
    const rent = floorplanCategory[floorplan];
    return rent;
}

function updateTotalMoveInCost() {
    const adminFeeValue = document.getElementById('admin_fee').innerText;
    const securityDepositValue = document.getElementById('security_deposit').innerText;
    const totalRentValue = document.getElementById('total_rent').innerText;
    const OneTimePetFeeValue = document.getElementById('one_time_pet_fee').innerText;


    const adminFee = parseFloat(adminFeeValue.replace('$', '')) || 0;
    const securityDeposit = parseFloat(securityDepositValue.replace('$', '')) || 0;
    const totalRent = parseFloat(totalRentValue.replace('$', '')) || 0;
    const OnePetFee = parseFloat(OneTimePetFeeValue.replace('$', '')) || 0;


    const totalMoveInCost = adminFee + securityDeposit + totalRent + OnePetFee;
    document.getElementById('total_move_in_cost').innerText = `$${totalMoveInCost.toFixed(2)}`;
}


function calculateRent() {
    const isStudent = document.getElementById('student_yes').checked;
    const isIncomeThreeTimesBaseRent = document.getElementById('income_yes').checked;
    const hasCar = document.getElementById('car_yes').checked;
    const floorplan = document.querySelector('input[name="floorplan"]:checked').value;
    let bedSize = document.querySelector('input[name="bed_size"]:checked')?.value || '';
  
    if (floorplan === '1x1' || floorplan === 'Studio') {
      bedSize = ''; // Set bedSize to an empty string for the 1x1 floor plan
    }
  
    const fullFloorplan = floorplan === 'Studio' ? `${floorplan} ${bedSize}`.trim() : `${floorplan.replace(" Standard", "")} ${bedSize}`.trim();
  
    const baseRent = calculateBaseRent(isStudent, fullFloorplan);
    const bedroomUpgrade = calculateBedroomUpgrade(isStudent, fullFloorplan, baseRent);
    const totalRent = calculateTotalRent(isStudent, fullFloorplan);
    const securityDeposit = calculateSecurityDeposit(isIncomeThreeTimesBaseRent, baseRent);
    const parkingFee = calculateParkingFee(isStudent, hasCar);
  
    document.getElementById('base_rent').innerText = `$${baseRent.toFixed(2)}`;
    document.getElementById('bedroom_upgrade').innerText = bedroomUpgrade;
    document.getElementById('total_rent').innerText = `$${totalRent.toFixed(2)}`;
    document.getElementById('security_deposit').innerText = `$${securityDeposit.toFixed(2)}`;
    document.getElementById('parking_fee').innerText = parkingFee;
  
    const adminFee = calculateAdminFee(isStudent);
    document.getElementById('admin_fee').innerText = adminFee;
  
    // Furniture fee
    const isFurnished = document.getElementById('furnished_yes').checked;
    const furnitureFee = calculateFurnitureFee(isStudent, isFurnished);
    document.getElementById('furniture_fee').innerText = furnitureFee;
  
    // Pet fee
    const hasPet = document.getElementById('pet_yes').checked;
    const isESA = document.getElementById('pet_esa').checked;
    const petFee = calculatePetFee(hasPet, isESA);
    document.getElementById('pet_fee').innerText = petFee;

    // One-time pet fee
    const oneTimePetFee = hasPet && !isESA ? prices.oneTimePetFee : 0;
    document.getElementById('one_time_pet_fee').innerText = hasPet ? `$${oneTimePetFee.toFixed(2)}` : "N/A";
    
  
    // Short Term Lease Fee
    const isShortTermLease = document.getElementById('short_term_lease_yes').checked;
    const shortTermLeaseFee = calculateShortTermLeaseFee(isShortTermLease);
    document.getElementById('short_term_lease_fee').innerText = shortTermLeaseFee;

    function convertToNumber(value) {
        if (isNaN(value) || value === "N/A" || value === "ESA") {
            return 0;
        }
        return parseFloat(value);
    }

    const bedroomUpgradeCost = bedroomUpgrade === "N/A" ? 0 : parseFloat(bedroomUpgrade.replace('$', ''));

    // Calculate the total monthly rent
    const total_monthly_rent =
        baseRent +
        bedroomUpgradeCost +
        convertToNumber(furnitureFee.replace('$', '')) +
        convertToNumber(parkingFee.replace('$', '')) +
        convertToNumber(shortTermLeaseFee.replace('$', '')) +
        (hasPet && !isESA ? prices.petFee : 0); // Add pet fee if applicable


    // Display the total monthly rent
    document.getElementById("total_rent").innerText = `$${total_monthly_rent.toFixed(2)}`;

    updateTotalMoveInCost();
    displayUtilities(); 

}

function updateOneTimePetFeeVisibility() {
    const hasPet = document.getElementById('pet_yes').checked;
    const oneTimePetFeeLine = document.getElementById('one_time_pet_fee_line');

    if (hasPet) {
        oneTimePetFeeLine.style.display = 'table-row';
    } else {
        oneTimePetFeeLine.style.display = 'none';
    }
}


// Car event Listener
document.getElementById('car_yes').addEventListener('change', calculateRent);
document.getElementById('car_no').addEventListener('change', calculateRent);


// Security Deposit event listener
document.getElementById('income_yes').addEventListener('change', calculateRent);
document.getElementById('income_no').addEventListener('change', calculateRent);

// Floor plan update event listener
document.getElementById('student_yes').addEventListener('change', updateFloorplanOptions);
document.getElementById('student_no').addEventListener('change', updateFloorplanOptions);

document.getElementById('student_yes').addEventListener('change', calculateRent);
document.getElementById('student_no').addEventListener('change', calculateRent);

// Short Term Lease event listeners
document.getElementById('short_term_lease_yes').addEventListener('change', calculateRent);
document.getElementById('short_term_lease_no').addEventListener('change', calculateRent);


const floorplanRadioButtons = document.getElementsByName('floorplan');
for (const floorplanRadioButton of floorplanRadioButtons) {
    floorplanRadioButton.addEventListener('change', updateBedSizeOptions);

}


// Calculate rent event listener
document.getElementById('calculate').addEventListener('click', calculateRent);

// Furniture event listeners
document.getElementById('furnished_yes').addEventListener('change', calculateRent);
document.getElementById('furnished_no').addEventListener('change', calculateRent);


// Pet event listeners
document.getElementById('pet_yes').addEventListener('change', calculateRent);
document.getElementById('pet_no').addEventListener('change', calculateRent);
document.getElementById('pet_esa').addEventListener('change', calculateRent);
document.getElementById('pet_yes').addEventListener('change', updateOneTimePetFeeVisibility);
document.getElementById('pet_no').addEventListener('change', updateOneTimePetFeeVisibility);
document.getElementById('pet_esa').addEventListener('change', updateOneTimePetFeeVisibility);

// Utilities event listeners
document.getElementById("student_yes").addEventListener("change", displayUtilities);
document.getElementById("student_no").addEventListener("change", displayUtilities);

document.addEventListener('DOMContentLoaded', () => {
    updateBedSizeOptions();
    updateFloorplanOptions();
    updateOneTimePetFeeVisibility(); // Add this line


// Security Deposit
document.getElementById("income_custom").addEventListener("change", function() {
    if (this.checked) {
        document.getElementById("custom_security_deposit").style.display = "inline-block";
    }
});

document.getElementById("income_yes").addEventListener("change", function () {
    if (this.checked) {
        document.getElementById("custom_security_deposit").style.display = "none";
        resetCustomSecurityDepositInput();
        calculateRent();
    }
});

document.getElementById("income_no").addEventListener("change", function () {
    if (this.checked) {
        document.getElementById("custom_security_deposit").style.display = "none";
        resetCustomSecurityDepositInput();
        calculateRent();
    }
});


document.getElementById("custom_security_deposit").addEventListener("input", calculateRent);


})
