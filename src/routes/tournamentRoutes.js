const express = require('express');
const { Op } = require('sequelize');
const { Tournament, Member } = require('../models');

const router = express.Router();

/**
 * POST /api/tournaments
 * Add a new Tournament
 */
router.post('/', async (req, res) => {
  try {
    const tournament = await Tournament.create(req.body);
    res.status(201).json(tournament);
  } catch (err) {
    console.error('Error creating tournament:', err);
    res.status(500).json({ error: 'Failed to create tournament' });
  }
});

/**
 * GET /api/tournaments
 * Search Tournaments by:
 * - startDate
 * - location (partial)
 */
router.get('/', async (req, res) => {
  try {
    const { startDate, location } = req.query;

    const where = {};

    if (startDate) {
      where.startDate = startDate;
    }

    if (location) {
      // SQLite: use LIKE instead of ILIKE
      where.location = { [Op.like]: `%${location}%` };
    }

    const tournaments = await Tournament.findAll({
      where,
      include: {
        model: Member,
        through: { attributes: [] }
      }
    });

    res.json(tournaments);
  } catch (err) {
    console.error('Error fetching tournaments:', err);
    res.status(500).json({ error: 'Failed to fetch tournaments' });
  }
});

/**
 * POST /api/tournaments/:id/members
 * Add a Member to a Tournament
 * Body: { "memberId": 1 }
 */
router.post('/:id/members', async (req, res) => {
  try {
    const tournament = await Tournament.findByPk(req.params.id);
    if (!tournament) {
      return res.status(404).json({ error: 'Tournament not found' });
    }

    const { memberId } = req.body;
    const member = await Member.findByPk(memberId);

    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    await tournament.addMember(member);

    const updatedTournament = await Tournament.findByPk(req.params.id, {
      include: {
        model: Member,
        through: { attributes: [] }
      }
    });

    res.json(updatedTournament);
  } catch (err) {
    console.error('Error adding member to tournament:', err);
    res.status(500).json({ error: 'Failed to add member to tournament' });
  }
});

/**
 * GET /api/tournaments/:id/members
 * Get all Members in a Tournament
 */
router.get('/:id/members', async (req, res) => {
  try {
    const tournament = await Tournament.findByPk(req.params.id);

    if (!tournament) {
      return res.status(404).json({ error: 'Tournament not found' });
    }

    const members = await tournament.getMembers();
    res.json(members);
  } catch (err) {
    console.error('Error fetching tournament members:', err);
    res.status(500).json({ error: 'Failed to fetch tournament members' });
  }
});

module.exports = router;
