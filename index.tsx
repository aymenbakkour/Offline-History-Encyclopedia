/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// All historical data is stored locally for offline access.
const historyData = {
    ancient: [
        {
            title: "The Roman Empire",
            content: "The Roman Empire was the post-Republican period of ancient Rome. As a polity it included large territorial holdings around the Mediterranean Sea in Europe, North Africa, and Western Asia ruled by emperors. From the accession of Caesar Augustus as the first Roman emperor to the military anarchy of the 3rd century, it was a principate with Italy as metropole of the provinces and its city of Rome as sole capital."
        },
        {
            title: "Ancient Greece",
            content: "Ancient Greece was a northeastern Mediterranean civilization, existing from the Greek Dark Ages of the 12th–9th centuries BC to the end of classical antiquity (c. AD 600), that comprised a loose collection of culturally and linguistically related city-states and other territories—unified only once, for 13 years, under Alexander the Great's empire."
        }
    ],
    middle_ages: [
        {
            title: "The Vikings",
            content: "Vikings were the seafaring Norse people from southern Scandinavia (present-day Denmark, Norway and Sweden) who from the late 8th to late 11th centuries raided, pirated, traded and settled throughout parts of Europe. They also voyaged as far as the Mediterranean, North Africa, the Middle East, and North America."
        },
        {
            title: "The Byzantine Empire",
            content: "The Byzantine Empire, also referred to as the Eastern Roman Empire, was the continuation of the Roman Empire in its eastern provinces during Late Antiquity and the Middle Ages, when its capital city was Constantinople. It survived the fragmentation and fall of the Western Roman Empire in the 5th century AD and continued to exist for an additional thousand years until it fell to the Ottoman Empire in 1453."
        }
    ],
    renaissance: [
        {
            title: "The Italian Renaissance",
            content: "The Italian Renaissance was a period in Italian history covering the 15th and 16th centuries. The period is known for the development of a culture that spread across Europe and marked the transition from the Middle Ages to modernity. Proponents of a 'long Renaissance' argue that it began in the 14th century and lasted until the 17th century."
        },
        {
            title: "Leonardo da Vinci",
            content: "Leonardo di ser Piero da Vinci was an Italian polymath of the High Renaissance who was active as a painter, draughtsman, engineer, scientist, theorist, sculptor and architect. While his fame initially rested on his achievements as a painter, he also became known for his notebooks, in which he made drawings and notes on a variety of subjects, including anatomy, astronomy, botany, cartography, painting, and paleontology."
        }
    ],
    modern: [
        {
            title: "The Industrial Revolution",
            content: "The Industrial Revolution was the transition to new manufacturing processes in Europe and the United States, in the period from about 1760 to sometime between 1820 and 1840. This transition included going from hand production methods to machines, new chemical manufacturing and iron production processes, the increasing use of steam power and water power, the development of machine tools and the rise of the mechanized factory system."
        },
        {
            title: "World War I",
            content: "World War I, also known as the First World War or the Great War, was a global war originating in Europe that lasted from 28 July 1914 to 11 November 1918. Contemporaneously described as 'the war to end all wars', it led to the mobilisation of more than 70 million military personnel, including 60 million Europeans, making it one of the largest wars in history."
        }
    ]
};

const contentElement = document.getElementById('content');
// Fix for error on line 122: Property 'dataset' does not exist on type 'Element'.
// By specifying the generic type for querySelectorAll, `navLinks` is correctly typed as a NodeListOf<HTMLAnchorElement>.
const navLinks = document.querySelectorAll<HTMLAnchorElement>('nav a');
// Fix for error on line 98: Property 'value' does not exist on type 'HTMLElement'.
// Fix for error on line 140: Property 'value' does not exist on type 'HTMLElement'.
// Cast the result of getElementById to HTMLInputElement to access the 'value' property.
const searchInput = document.getElementById('searchInput') as HTMLInputElement;
const searchButton = document.getElementById('searchButton');

function displayContent(period: string) {
    contentElement.innerHTML = '';
    const articles = historyData[period] || [];

    if (articles.length === 0) {
        contentElement.innerHTML = '<p>No content found for this period.</p>';
        return;
    }

    articles.forEach(article => {
        const articleDiv = document.createElement('div');
        articleDiv.className = 'article';
        articleDiv.innerHTML = `
            <h2>${article.title}</h2>
            <p>${article.content}</p>
        `;
        contentElement.appendChild(articleDiv);
    });
}

function displaySearchResults(results: Array<{title: string, content: string, period: string}>) {
    contentElement.innerHTML = '';

    if (results.length === 0) {
        contentElement.innerHTML = '<p>No results found for your search.</p>';
        return;
    }
    
    results.forEach(result => {
        const articleDiv = document.createElement('div');
        articleDiv.className = 'article';
        // Sanitize period name for display
        const periodName = result.period.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
        articleDiv.innerHTML = `
            <h2>${result.title}</h2>
            <p>${result.content}</p>
            <footer><small>Found in: ${periodName}</small></footer>
        `;
        contentElement.appendChild(articleDiv);
    });
}

function performSearch() {
    const query = searchInput.value.toLowerCase().trim();
    if (!query) {
        // If search is cleared, go back to the default view
        displayContent('ancient');
        setActiveLink('ancient');
        return;
    }
    
    const results = [];
    for (const period in historyData) {
        historyData[period].forEach(article => {
            if (article.title.toLowerCase().includes(query) || article.content.toLowerCase().includes(query)) {
                results.push({ ...article, period });
            }
        });
    }

    displaySearchResults(results);
    clearActiveLinks();
}


function setActiveLink(period: string) {
    navLinks.forEach(link => {
        if (link.dataset.period === period) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

function clearActiveLinks() {
     navLinks.forEach(link => link.classList.remove('active'));
}

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        // Fix for error on line 137: Property 'dataset' does not exist on type 'EventTarget'.
        // Cast e.target to HTMLAnchorElement to access the 'dataset' property.
        const period = (e.target as HTMLAnchorElement).dataset.period;
        displayContent(period);
        setActiveLink(period);
        searchInput.value = ''; // Clear search when navigating
    });
});

searchButton.addEventListener('click', performSearch);
searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        performSearch();
    }
});


// --- Initial Load ---
// Display the first category by default when the app loads.
document.addEventListener('DOMContentLoaded', () => {
    displayContent('ancient');
    setActiveLink('ancient');
});
