import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Tooltip
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

function App() {
  const [topic, setTopic] = useState('');
  const [language, setLanguage] = useState('');
  const [difficulty, setDifficulty] = useState('beginner');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [problems, setProblems] = useState(null);
  const [pathDescription, setPathDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setProblems(null);
    setPathDescription('');

    try {
      const response = await fetch('http://localhost:3001/generate-problems', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          language,
          difficulty
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setProblems(data.learningPath.problems);
        setPathDescription(data.learningPath.description);
      } else {
        setError(data.error || 'Failed to generate problems');
      }
    } catch (err) {
      setError('Failed to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  const handleLearnMore = (problem) => {
    // Create a new topic based on the problem title and concepts
    const newTopic = `${problem.title}: ${problem.concepts.join(', ')}`;
    
    // Open a new tab with the problem details
    const newWindow = window.open('', '_blank');
    
    // Store the problem details in localStorage for the new tab
    localStorage.setItem('learnMoreDetails', JSON.stringify({
      topic: newTopic,
      language,
      difficulty
    }));
    
    // Navigate to the same app but with a special query parameter
    newWindow.location.href = `${window.location.origin}?learnMore=true`;
  };

  // Check if this is a "Learn More" tab on load
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const isLearnMore = urlParams.get('learnMore');
    
    if (isLearnMore) {
      const storedDetails = localStorage.getItem('learnMoreDetails');
      if (storedDetails) {
        const details = JSON.parse(storedDetails);
        setTopic(details.topic);
        setLanguage(details.language);
        setDifficulty(details.difficulty);
        
        // Clear the stored details
        localStorage.removeItem('learnMoreDetails');
        
        // Automatically submit the form
        setTimeout(() => {
          document.getElementById('generateForm').dispatchEvent(
            new Event('submit', { cancelable: true, bubbles: true })
          );
        }, 500);
      }
    }
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Programming Problem Generator
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <form id="generateForm" onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
            <TextField
              fullWidth
              label="Topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Programming Language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              required
              variant="outlined"
            />
            <FormControl fullWidth variant="outlined">
              <InputLabel>Difficulty</InputLabel>
              <Select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                label="Difficulty"
              >
                <MenuItem value="beginner">Beginner</MenuItem>
                <MenuItem value="intermediate">Intermediate</MenuItem>
                <MenuItem value="advanced">Advanced</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Generate Problems'}
          </Button>
        </form>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {pathDescription && (
        <Paper elevation={2} sx={{ p: 2, mb: 3, bgcolor: 'primary.light' }}>
          <Typography variant="h6" color="white" gutterBottom>
            Learning Journey
          </Typography>
          <Typography variant="body1" color="white">
            {pathDescription}
          </Typography>
        </Paper>
      )}

      {problems && problems.map((problem, index) => (
        <Card key={index} sx={{ mb: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" component="h2">
                {problem.title}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip 
                  label={`Level ${problem.level}`} 
                  color="primary" 
                  variant="outlined"
                />
                <Chip 
                  label={difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} 
                  color="secondary" 
                  variant="outlined"
                />
                <Tooltip title="Learn more about this topic (opens in new tab)">
                  <IconButton 
                    color="primary" 
                    onClick={() => handleLearnMore(problem)}
                    aria-label="learn more"
                  >
                    <OpenInNewIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            <Box sx={{ mb: 2 }}>
              {problem.concepts.map((concept, i) => (
                <Chip
                  key={i}
                  label={concept}
                  size="small"
                  sx={{ mr: 1, mb: 1 }}
                />
              ))}
            </Box>

            <Typography variant="body1" paragraph>
              {problem.description}
            </Typography>

            <Typography variant="h6" gutterBottom>
              Prerequisites:
            </Typography>
            <List dense>
              {problem.prerequisites.map((prereq, i) => (
                <ListItem key={i}>
                  <ListItemText primary={prereq} />
                </ListItem>
              ))}
            </List>

            {problem.hints && problem.hints.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Hints:
                </Typography>
                <List dense>
                  {problem.hints.map((hint, i) => (
                    <ListItem key={i}>
                      <ListItemText primary={hint} />
                    </ListItem>
                  ))}
                </List>
              </>
            )}
            
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                endIcon={<OpenInNewIcon />}
                onClick={() => handleLearnMore(problem)}
              >
                Learn More
              </Button>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
}

export default App;
