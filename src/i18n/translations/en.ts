export const en = {
	'bottomNav.home': 'Home',
	'bottomNav.statistics': 'Stats',
	'bottomNav.budgets': 'Budgets',
	'bottomNav.settings': 'Settings',
	'settings.title': 'Settings',
	'settings.categories': 'Categories',
	'settings.language': 'Language',
	'settings.theme': 'Theme',
	'categories.drawer.title': 'Categories',
	'categories.drawer.newTitle': 'New category',
	'categories.drawer.editTitle': 'Edit category',
	'categories.drawer.close': 'Close',
	'categories.drawer.add': 'Add category',
	'categories.form.namePlaceholder': 'Category name',
	'categories.form.color': 'Color',
	'categories.form.icon': 'Icon',
	'categories.form.delete': 'Delete category',
	'common.save': 'Save',
} as const

export type TranslationDictionary = Record<keyof typeof en, string>
