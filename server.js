const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let savedPapers = [];

// Mock research papers
const mockPapers = [
  { id: '1', title: 'AI in Healthcare: Revolutionizing Patient Care', authors: 'John Doe, Jane Smith', year: 2021, citations: 45 },
  { id: '2', title: 'Machine Learning Applications in Finance', authors: 'Alice Johnson, Bob Williams', year: 2020, citations: 32 },
  { id: '3', title: 'Blockchain Technology: Beyond Cryptocurrencies', authors: 'Carol Brown, David Lee', year: 2019, citations: 28 },
  { id: '4', title: 'Natural Language Processing Advances', authors: 'Emily Davis, Frank Moore', year: 2022, citations: 67 },
  { id: '5', title: 'Quantum Computing: Future of Tech', authors: 'Grace Miller, Henry Taylor', year: 2021, citations: 50 },
  { id: '6', title: 'Cybersecurity in the Modern Era', authors: 'Ian Carter, Jane White', year: 2023, citations: 12 },
  { id: '7', title: 'Augmented Reality: A New Perspective', authors: 'Kate Adams, Leo Martinez', year: 2020, citations: 41 },
  { id: '8', title: 'Autonomous Vehicles and AI', authors: 'Michael Green, Olivia Harris', year: 2021, citations: 73 },
  { id: '9', title: 'Deep Learning for Image Recognition', authors: 'Nancy Hall, Paul Walker', year: 2022, citations: 60 },
  { id: '10', title: 'The Rise of Renewable Energy', authors: 'Rachel Turner, Steve Lee', year: 2018, citations: 85 }
];

// Get all papers
app.get('/api/papers', (req, res) => {
  res.json(mockPapers);  // Return all papers initially
});

// Search papers by any part of the content
app.get('/api/search-papers', (req, res) => {
  const searchTerm = req.query.query?.toLowerCase();

  if (!searchTerm) {
    return res.status(400).json({ message: 'Query parameter is missing' });
  }

  const filteredPapers = mockPapers.filter(paper =>
    paper.title.toLowerCase().includes(searchTerm) ||
    paper.authors.toLowerCase().includes(searchTerm) ||
    String(paper.citations).includes(searchTerm) // Check if search term exists in citations
  );

  if (filteredPapers.length === 0) {
    return res.status(404).json({ message: 'No such article found' });
  }

  res.json(filteredPapers);
});

// Save a paper
app.post('/api/saved-papers', (req, res) => {
  const paper = req.body;
  
  if (!paper || !paper.id || !paper.title || !paper.authors) {
    return res.status(400).json({ message: 'Invalid paper data' });
  }

  if (!savedPapers.some(p => p.id === paper.id)) {
    savedPapers.push(paper);
  }

  res.status(201).json(savedPapers);
});

// Remove a saved paper
app.delete('/api/saved-papers/:id', (req, res) => {
  const paperId = req.params.id;
  const paperIndex = savedPapers.findIndex(p => p.id === paperId);

  if (paperIndex === -1) {
    return res.status(404).json({ message: 'Paper not found' });
  }

  savedPapers = savedPapers.filter(p => p.id !== paperId);
  res.status(200).json(savedPapers);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
