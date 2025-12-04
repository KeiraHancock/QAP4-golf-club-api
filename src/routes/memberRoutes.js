const express = require('express');
const { Op } = require('sequelize');
const { Member, Tournament } = require('../models');

const router = express.Router();

/**
 * POST /api/members
 * Add a new Member
 */
router.post('/', async (req, res) => {
  try {
    const member = await Member.create(req.body);
    res.status(201).json(member);
  } catch (err) {
    console.error('Error creating member:', err);
    res.status(500).json({ error: 'Failed to create member' });
  }
});

/**
 * GET /api/members
 * Search Members by:
 * - name (partial)
 * - membershipType
 * - phone
 * - membershipStartDate
 * - tournamentStartDate (find members in tournaments starting on a date)
 */
router.get('/', async (req, res) => {
  try {
    const {
      name,
      membershipType,
      phone,
      membershipStartDate,
      tournamentStartDate
    } = req.query;

    const where = {};

    if (name) {
      // SQLite: use LIKE instead of ILIKE
      where.name = { [Op.like]: `%${name}%` };
    }

    if (membershipType) {
      where.membershipType = membershipType;
    }

    if (phone) {
      // partial phone match
      where.phone = { [Op.like]: `%${phone}%` };
    }

    if (membershipStartDate) {
      where.membershipStartDate = membershipStartDate;
    }

    const include = [];

    if (tournamentStartDate) {
      include.push({
        model: Tournament,
        where: {
          startDate: tournamentStartDate
        },
        through: { attributes: [] }
      });
    } else {
      include.push({
        model: Tournament,
        through: { attributes: [] }
      });
    }

    const members = await Member.findAll({
      where,
      include
    });

    res.json(members);
  } catch (err) {
    console.error('Error fetching members:', err);
    res.status(500).json({ error: 'Failed to fetch members' });
  }
});

/**
 * GET /api/members/:id
 * Get a single member and their tournaments
 */
router.get('/:id', async (req, res) => {
  try {
    const member = await Member.findByPk(req.params.id, {
      include: {
        model: Tournament,
        through: { attributes: [] }
      }
    });

    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    res.json(member);
  } catch (err) {
    console.error('Error fetching member:', err);
    res.status(500).json({ error: 'Failed to fetch member' });
  }
});

/**
 * GET /api/members/:id/tournaments
 * Get all tournaments for a specific member
 */
router.get('/:id/tournaments', async (req, res) => {
  try {
    const member = await Member.findByPk(req.params.id);
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    const tournaments = await member.getTournaments();
    res.json(tournaments);
  } catch (err) {
    console.error('Error fetching member tournaments:', err);
    res.status(500).json({ error: 'Failed to fetch member tournaments' });
  }
});

module.exports = router;
