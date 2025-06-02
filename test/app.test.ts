describe('Messagerie Tests', () => {
    
    describe('Utilitaires', () => {
        test('Génération d\'ID unique', () => {
            const generateId = (): string => {
                return Math.random().toString(36).substring(2) + Date.now().toString(36);
            };

            const id1 = generateId();
            const id2 = generateId();
            
            expect(id1).toBeDefined();
            expect(id2).toBeDefined();
            expect(id1).not.toBe(id2);
            expect(typeof id1).toBe('string');
            expect(id1.length).toBeGreaterThan(0);
        });

    });

    describe('Gestion des messages', () => {
        test('Limitation de l\'historique', () => {
            const messages: any[] = [];
            const MAX_MESSAGES = 5;
            
            const addMessage = (message: any): void => {
                messages.push(message);
                if (messages.length > MAX_MESSAGES) {
                    messages.shift();
                }
            };

            // Ajouter plus de messages que la limite
            for (let i = 0; i < 8; i++) {
                addMessage({ id: i, text: `Message ${i}` });
            }

            expect(messages.length).toBe(MAX_MESSAGES);
            expect(messages[0].id).toBe(3); // Les 3 premiers ont été supprimés
            expect(messages[4].id).toBe(7); // Le dernier message
        });

        test('Filtrage des messages vides', () => {
            const filterValidMessages = (texts: string[]): string[] => {
                return texts.filter(text => text && text.trim().length > 0);
            };

            const inputs = ['Hello', '', '  ', 'World', '   Test   '];
            const result = filterValidMessages(inputs);

            expect(result).toEqual(['Hello', 'World', '   Test   ']);
            expect(result.length).toBe(3);
        });
    });

    describe('Gestion des utilisateurs', () => {
        test('Création d\'un utilisateur', () => {
            interface User {
                id: string;
                username: string;
                joinedAt: Date;
            }

            const createUser = (id: string, username: string): User => {
                return {
                    id,
                    username: username.trim(),
                    joinedAt: new Date()
                };
            };

            const user = createUser('test-123', '  ChatUser  ');
            
            expect(user.id).toBe('test-123');
            expect(user.username).toBe('ChatUser');
            expect(user.joinedAt).toBeInstanceOf(Date);
        });

        test('Vérification des doublons', () => {
            const users = new Map<string, { username: string }>();
            users.set('1', { username: 'Alice' });
            users.set('2', { username: 'Bob' });

            const isUsernameTaken = (username: string): boolean => {
                return Array.from(users.values()).some(user => user.username === username);
            };

            expect(isUsernameTaken('Alice')).toBe(true);
            expect(isUsernameTaken('Charlie')).toBe(false);
            expect(isUsernameTaken('alice')).toBe(false); // Case sensitive
        });
    });

    describe('Configuration', () => {
        test('Variables d\'environnement par défaut', () => {
            const getPort = (): number => {
                return parseInt(process.env.PORT || '3000');
            };

            const getMaxMessages = (): number => {
                return parseInt(process.env.MAX_MESSAGES || '100');
            };

            expect(getPort()).toBe(3000);
            expect(getMaxMessages()).toBe(100);
            expect(typeof getPort()).toBe('number');
        });
    });
});