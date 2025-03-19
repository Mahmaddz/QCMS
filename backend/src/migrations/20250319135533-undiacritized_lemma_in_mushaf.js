module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Mushaf', 'LemmaUndiacritized', {
      type: Sequelize.STRING, // Define as a string column
      allowNull: true, // Change as needed
    });
  },

  down: async (queryInterface) => {
    return queryInterface.removeColumn('Mushaf', 'LemmaUndiacritized');
  },
};
