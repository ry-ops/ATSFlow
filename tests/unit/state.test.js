/**
 * Unit Tests for ResumeState (state.js)
 * Tests the core state management system
 */

// Mock localStorage before importing
const mockLocalStorage = {
  data: {},
  getItem: jest.fn((key) => mockLocalStorage.data[key] || null),
  setItem: jest.fn((key, value) => { mockLocalStorage.data[key] = value; }),
  removeItem: jest.fn((key) => { delete mockLocalStorage.data[key]; }),
  clear: jest.fn(() => { mockLocalStorage.data = {}; })
};

global.localStorage = mockLocalStorage;

// Import the module after mocking localStorage
const ResumeState = require('../../js/state.js');

describe('ResumeState', () => {
  let state;

  beforeEach(() => {
    // Create a fresh instance for each test
    state = new ResumeState();
    mockLocalStorage.clear();
    jest.clearAllMocks();
  });

  describe('Initialization', () => {
    test('should initialize with default state', () => {
      const initialState = state.getState();

      expect(initialState).toHaveProperty('sections');
      expect(initialState).toHaveProperty('activeSection');
      expect(initialState).toHaveProperty('editorMode');
      expect(initialState).toHaveProperty('template');
      expect(initialState).toHaveProperty('customization');
      expect(initialState).toHaveProperty('metadata');
      expect(initialState).toHaveProperty('ui');
    });

    test('should have empty sections array initially', () => {
      expect(state.getSections()).toEqual([]);
    });

    test('should have default editor mode as "edit"', () => {
      expect(state.getEditorMode()).toBe('edit');
    });

    test('should have default template as "modern"', () => {
      expect(state.getTemplate()).toBe('modern');
    });
  });

  describe('Section Management', () => {
    describe('addSection', () => {
      test('should add a new section', () => {
        const section = {
          type: 'experience',
          content: { title: 'Software Engineer' }
        };

        const added = state.addSection(section);

        expect(state.getSections()).toHaveLength(1);
        expect(added).toHaveProperty('id');
        expect(added.type).toBe('experience');
      });

      test('should generate unique IDs for sections', () => {
        const section1 = state.addSection({ type: 'experience' });
        const section2 = state.addSection({ type: 'education' });

        expect(section1.id).not.toBe(section2.id);
      });

      test('should preserve provided section ID', () => {
        const section = {
          id: 'custom-id',
          type: 'experience'
        };

        const added = state.addSection(section);
        expect(added.id).toBe('custom-id');
      });

      test('should emit sectionAdded event', () => {
        const callback = jest.fn();
        state.on('sectionAdded', callback);

        const section = state.addSection({ type: 'experience' });

        expect(callback).toHaveBeenCalledWith(section);
      });

      test('should mark state as modified', () => {
        const modifiedCallback = jest.fn();
        state.on('stateModified', modifiedCallback);

        state.addSection({ type: 'experience' });

        expect(modifiedCallback).toHaveBeenCalled();
        expect(state.getUIState().saveStatus).toBe('unsaved');
      });
    });

    describe('removeSection', () => {
      test('should remove a section by ID', () => {
        const section = state.addSection({ type: 'experience' });

        const removed = state.removeSection(section.id);

        expect(removed).toEqual(section);
        expect(state.getSections()).toHaveLength(0);
      });

      test('should return null if section not found', () => {
        const removed = state.removeSection('non-existent-id');
        expect(removed).toBeNull();
      });

      test('should emit sectionRemoved event', () => {
        const callback = jest.fn();
        state.on('sectionRemoved', callback);

        const section = state.addSection({ type: 'experience' });
        state.removeSection(section.id);

        expect(callback).toHaveBeenCalledWith(section);
      });
    });

    describe('updateSection', () => {
      test('should update section properties', () => {
        const section = state.addSection({ type: 'experience', title: 'Old Title' });

        const updated = state.updateSection(section.id, { title: 'New Title' });

        expect(updated.title).toBe('New Title');
        expect(state.getSection(section.id).title).toBe('New Title');
      });

      test('should return null if section not found', () => {
        const updated = state.updateSection('non-existent-id', { title: 'Test' });
        expect(updated).toBeNull();
      });

      test('should emit sectionUpdated event', () => {
        const callback = jest.fn();
        state.on('sectionUpdated', callback);

        const section = state.addSection({ type: 'experience' });
        state.updateSection(section.id, { title: 'Updated' });

        expect(callback).toHaveBeenCalled();
      });
    });

    describe('updateSectionContent', () => {
      test('should update section content fields', () => {
        const section = state.addSection({
          type: 'experience',
          content: { title: 'Engineer', company: 'ABC Inc' }
        });

        state.updateSectionContent(section.id, { company: 'XYZ Corp' });

        const updated = state.getSection(section.id);
        expect(updated.content.title).toBe('Engineer');
        expect(updated.content.company).toBe('XYZ Corp');
      });

      test('should emit sectionContentUpdated event', () => {
        const callback = jest.fn();
        state.on('sectionContentUpdated', callback);

        const section = state.addSection({ type: 'experience', content: {} });
        state.updateSectionContent(section.id, { title: 'Updated' });

        expect(callback).toHaveBeenCalled();
      });
    });

    describe('getSection', () => {
      test('should retrieve section by ID', () => {
        const section = state.addSection({ type: 'experience', title: 'Test' });

        const retrieved = state.getSection(section.id);

        expect(retrieved).toEqual(section);
      });

      test('should return undefined if section not found', () => {
        const retrieved = state.getSection('non-existent-id');
        expect(retrieved).toBeUndefined();
      });
    });

    describe('reorderSections', () => {
      test('should reorder sections from one index to another', () => {
        const section1 = state.addSection({ type: 'education', order: 1 });
        const section2 = state.addSection({ type: 'experience', order: 2 });
        const section3 = state.addSection({ type: 'skills', order: 3 });

        state.reorderSections(0, 2); // Move first to last

        const sections = state.getSections();
        expect(sections[0]).toEqual(section2);
        expect(sections[1]).toEqual(section3);
        expect(sections[2]).toEqual(section1);
      });

      test('should emit sectionsReordered event', () => {
        const callback = jest.fn();
        state.on('sectionsReordered', callback);

        state.addSection({ type: 'education' });
        state.addSection({ type: 'experience' });

        state.reorderSections(0, 1);

        expect(callback).toHaveBeenCalledWith({ fromIndex: 0, toIndex: 1 });
      });
    });

    describe('moveSection', () => {
      test('should move section to new position by ID', () => {
        const section1 = state.addSection({ type: 'education' });
        const section2 = state.addSection({ type: 'experience' });
        const section3 = state.addSection({ type: 'skills' });

        state.moveSection(section1.id, 2);

        const sections = state.getSections();
        expect(sections[2]).toEqual(section1);
      });

      test('should handle invalid section ID gracefully', () => {
        state.addSection({ type: 'education' });

        expect(() => {
          state.moveSection('invalid-id', 1);
        }).not.toThrow();
      });
    });
  });

  describe('Active Section Management', () => {
    test('should set active section', () => {
      state.setActiveSection('section-123');
      expect(state.getActiveSection()).toBe('section-123');
    });

    test('should emit activeSectionChanged event', () => {
      const callback = jest.fn();
      state.on('activeSectionChanged', callback);

      state.setActiveSection('section-123');

      expect(callback).toHaveBeenCalledWith('section-123');
    });

    test('should start with null active section', () => {
      expect(state.getActiveSection()).toBeNull();
    });
  });

  describe('Editor Mode Management', () => {
    test('should set editor mode', () => {
      state.setEditorMode('preview');
      expect(state.getEditorMode()).toBe('preview');
    });

    test('should emit editorModeChanged event', () => {
      const callback = jest.fn();
      state.on('editorModeChanged', callback);

      state.setEditorMode('split');

      expect(callback).toHaveBeenCalledWith('split');
    });
  });

  describe('Template Management', () => {
    test('should set template', () => {
      state.setTemplate('professional');
      expect(state.getTemplate()).toBe('professional');
    });

    test('should emit templateChanged event', () => {
      const callback = jest.fn();
      state.on('templateChanged', callback);

      state.setTemplate('creative');

      expect(callback).toHaveBeenCalledWith('creative');
    });
  });

  describe('Customization Management', () => {
    test('should get customization settings', () => {
      const customization = state.getCustomization();

      expect(customization).toHaveProperty('primaryColor');
      expect(customization).toHaveProperty('secondaryColor');
      expect(customization).toHaveProperty('headingFont');
    });

    test('should update customization settings', () => {
      state.updateCustomization({ primaryColor: '#ff0000' });

      const customization = state.getCustomization();
      expect(customization.primaryColor).toBe('#ff0000');
    });

    test('should emit customizationChanged event', () => {
      const callback = jest.fn();
      state.on('customizationChanged', callback);

      state.updateCustomization({ primaryColor: '#ff0000' });

      expect(callback).toHaveBeenCalled();
    });

    test('should preserve other customization settings', () => {
      const original = state.getCustomization();
      state.updateCustomization({ primaryColor: '#ff0000' });

      const updated = state.getCustomization();
      expect(updated.secondaryColor).toBe(original.secondaryColor);
      expect(updated.headingFont).toBe(original.headingFont);
    });
  });

  describe('UI State Management', () => {
    test('should get UI state', () => {
      const uiState = state.getUIState();

      expect(uiState).toHaveProperty('sidebarOpen');
      expect(uiState).toHaveProperty('previewVisible');
      expect(uiState).toHaveProperty('saveStatus');
    });

    test('should update UI state', () => {
      state.updateUIState({ sidebarOpen: false });

      const uiState = state.getUIState();
      expect(uiState.sidebarOpen).toBe(false);
    });

    test('should emit uiStateChanged event', () => {
      const callback = jest.fn();
      state.on('uiStateChanged', callback);

      state.updateUIState({ sidebarOpen: false });

      expect(callback).toHaveBeenCalled();
    });

    test('should set save status', () => {
      state.setSaveStatus('saving');
      expect(state.getUIState().saveStatus).toBe('saving');
    });

    test('should emit saveStatusChanged event', () => {
      const callback = jest.fn();
      state.on('saveStatusChanged', callback);

      state.setSaveStatus('saved');

      expect(callback).toHaveBeenCalledWith('saved');
    });
  });

  describe('Event System', () => {
    test('should subscribe to events with on()', () => {
      const callback = jest.fn();
      state.on('testEvent', callback);

      state.emit('testEvent', 'test-data');

      expect(callback).toHaveBeenCalledWith('test-data');
    });

    test('should unsubscribe from events with off()', () => {
      const callback = jest.fn();
      state.on('testEvent', callback);
      state.off('testEvent', callback);

      state.emit('testEvent', 'test-data');

      expect(callback).not.toHaveBeenCalled();
    });

    test('should support multiple listeners for same event', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      state.on('testEvent', callback1);
      state.on('testEvent', callback2);

      state.emit('testEvent', 'test-data');

      expect(callback1).toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();
    });

    test('should handle errors in event listeners gracefully', () => {
      const errorCallback = jest.fn(() => { throw new Error('Test error'); });
      const successCallback = jest.fn();

      state.on('testEvent', errorCallback);
      state.on('testEvent', successCallback);

      expect(() => {
        state.emit('testEvent', 'test-data');
      }).not.toThrow();

      expect(successCallback).toHaveBeenCalled();
    });
  });

  describe('Persistence', () => {
    test('should save state to localStorage', () => {
      state.addSection({ type: 'experience' });

      const result = state.saveToStorage();

      expect(result).toBe(true);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'resumate_state',
        expect.any(String)
      );
    });

    test('should load state from localStorage', () => {
      const savedState = {
        sections: [{ id: 'test-id', type: 'experience' }],
        template: 'creative'
      };

      mockLocalStorage.data['resumate_state'] = JSON.stringify(savedState);

      const newState = new ResumeState();

      expect(newState.getSections()).toHaveLength(1);
      expect(newState.getTemplate()).toBe('creative');
    });

    test('should export state as JSON', () => {
      state.addSection({ type: 'experience' });

      const exported = state.exportState();
      const parsed = JSON.parse(exported);

      expect(parsed).toHaveProperty('sections');
      expect(parsed.sections).toHaveLength(1);
    });

    test('should import state from JSON', () => {
      const importData = {
        sections: [{ id: 'imported', type: 'education' }],
        template: 'minimal'
      };

      const result = state.importState(JSON.stringify(importData));

      expect(result).toBe(true);
      expect(state.getSections()).toHaveLength(1);
      expect(state.getTemplate()).toBe('minimal');
    });

    test('should handle invalid JSON import gracefully', () => {
      const result = state.importState('invalid json');
      expect(result).toBe(false);
    });
  });

  describe('State Reset', () => {
    test('should reset state to defaults', () => {
      state.addSection({ type: 'experience' });
      state.setTemplate('creative');
      state.setEditorMode('preview');

      state.reset();

      expect(state.getSections()).toHaveLength(0);
      expect(state.getTemplate()).toBe('modern');
      expect(state.getEditorMode()).toBe('edit');
    });

    test('should emit stateReset event', () => {
      const callback = jest.fn();
      state.on('stateReset', callback);

      state.reset();

      expect(callback).toHaveBeenCalled();
    });
  });

  describe('Metadata Management', () => {
    test('should update lastModified on modifications', () => {
      const before = state.getState().metadata.lastModified;

      state.addSection({ type: 'experience' });

      const after = state.getState().metadata.lastModified;
      expect(after).not.toBe(before);
      expect(after).toBeTruthy();
    });

    test('should set saveStatus to unsaved on modifications', () => {
      state.setSaveStatus('saved');

      state.addSection({ type: 'experience' });

      expect(state.getUIState().saveStatus).toBe('unsaved');
    });
  });

  describe('ID Generation', () => {
    test('should generate unique IDs', () => {
      const id1 = state.generateId();
      const id2 = state.generateId();

      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^section-/);
      expect(id2).toMatch(/^section-/);
    });
  });
});
