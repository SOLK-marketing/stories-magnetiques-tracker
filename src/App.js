import { useState } from "react";

const MODULES = [
  { id: 1, name: "Connexion", emoji: "🌟", color: "#FF6B35" },
  { id: 2, name: "Authenticité", emoji: "💫", color: "#F7931E" },
  { id: 3, name: "Autorité", emoji: "👑", color: "#C0392B" },
  { id: 4, name: "Désir", emoji: "🔥", color: "#E74C3C" },
  { id: 5, name: "Conversion", emoji: "💰", color: "#922B21" },
  { id: 6, name: "Storytelling", emoji: "✨", color: "#FF8C42" },
  { id: 7, name: "Engagement", emoji: "💬", color: "#D35400" },
  { id: 8, name: "Magnétisme", emoji: "🧲", color: "#A93226" },
];

const INITIAL_STUDENTS = [
  { id: 1, name: "Sarah M.", avatar: "SM", challenges: [true, true, true, false, false, false, false, false], joinDate: "2025-01-15" },
  { id: 2, name: "Julie R.", avatar: "JR", challenges: [true, true, false, false, false, false, false, false], joinDate: "2025-01-18" },
  { id: 3, name: "Amina D.", avatar: "AD", challenges: [true, true, true, true, true, false, false, false], joinDate: "2025-02-01" },
  { id: 4, name: "Camille B.", avatar: "CB", challenges: [true, false, false, false, false, false, false, false], joinDate: "2025-02-10" },
  { id: 5, name: "Fatou K.", avatar: "FK", challenges: [true, true, true, true, false, false, false, false], joinDate: "2025-02-14" },
  { id: 6, name: "Léa P.", avatar: "LP", challenges: [true, true, true, true, true, true, false, false], joinDate: "2025-01-20" },
  { id: 7, name: "Marie C.", avatar: "MC", challenges: [true, false, false, false, false, false, false, false], joinDate: "2025-02-20" },
  { id: 8, name: "Nina T.", avatar: "NT", challenges: [true, true, true, false, false, false, false, false], joinDate: "2025-01-28" },
];

const numModules = 8;

function getScore(student) {
  return student.challenges.filter(Boolean).length;
}

function getRank(students, student) {
  const sorted = [...students].sort((a, b) => getScore(b) - getScore(a));
  return sorted.findIndex(s => s.id === student.id) + 1;
}

function getMedal(rank) {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return null;
}

export default function App() {
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [filterModule, setFilterModule] = useState(null);

  const sorted = [...students].sort((a, b) => getScore(b) - getScore(a));

  const totalChallenges = students.reduce((sum, s) => sum + getScore(s), 0);
  const avgCompletion = Math.round((totalChallenges / (students.length * numModules)) * 100);
  const fullCompleters = students.filter(s => getScore(s) === numModules).length;
  const activeStudents = students.filter(s => getScore(s) > 0).length;

  function toggleChallenge(studentId, moduleIdx) {
    setStudents(prev =>
      prev.map(s => {
        if (s.id !== studentId) return s;
        const challenges = [...s.challenges];
        challenges[moduleIdx] = !challenges[moduleIdx];
        return { ...s, challenges };
      })
    );
  }

  function addStudent() {
    if (!newName.trim()) return;
    const initials = newName.trim().split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
    setStudents(prev => [
      ...prev,
      {
        id: Date.now(),
        name: newName.trim(),
        avatar: initials,
        challenges: Array(numModules).fill(false),
        joinDate: new Date().toISOString().split("T")[0],
      }
    ]);
    setNewName("");
    setShowAddModal(false);
  }

  const filteredStudents = filterModule !== null
    ? students.filter(s => s.challenges[filterModule])
    : students;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0D0D0D",
      fontFamily: "'Georgia', serif",
      color: "#F5F0E8",
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #1A0A00 0%, #2D1200 50%, #1A0A00 100%)",
        borderBottom: "1px solid #FF6B35",
        padding: "0 24px",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 0 0" }}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: 4, color: "#FF6B35", marginBottom: 4, textTransform: "uppercase" }}>
                Bizzengalere
              </div>
              <h1 style={{ margin: 0, fontSize: 26, fontWeight: "normal", color: "#FFF8F0" }}>
                Stories Magnétiques ✨
              </h1>
              <div style={{ fontSize: 13, color: "#C0A08A", marginTop: 4 }}>
                Tracker des challenges — Session 2025
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              style={{
                background: "#FF6B35",
                color: "#fff",
                border: "none",
                padding: "10px 20px",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 13,
                fontFamily: "Georgia, serif",
                letterSpacing: 1,
              }}
            >
              + Ajouter une élève
            </button>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 0, marginTop: 20 }}>
            {[
              { id: "dashboard", label: "Vue d'ensemble" },
              { id: "grid", label: "Grille challenges" },
              { id: "leaderboard", label: "Classement" },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: "none",
                  border: "none",
                  borderBottom: activeTab === tab.id ? "2px solid #FF6B35" : "2px solid transparent",
                  color: activeTab === tab.id ? "#FF6B35" : "#8A7060",
                  padding: "12px 20px",
                  cursor: "pointer",
                  fontSize: 13,
                  fontFamily: "Georgia, serif",
                  letterSpacing: 1,
                  transition: "all 0.2s",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px" }}>

        {/* Stats cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
          {[
            { label: "Élèves actives", value: activeStudents, sub: `sur ${students.length} inscrites`, icon: "👩‍💻" },
            { label: "Challenges complétés", value: totalChallenges, sub: `sur ${students.length * numModules} possibles`, icon: "✅" },
            { label: "Complétion moyenne", value: `${avgCompletion}%`, sub: "de la formation", icon: "📊" },
            { label: "Formation complète", value: fullCompleters, sub: "élèves au bout", icon: "🏆" },
          ].map((stat, i) => (
            <div key={i} style={{
              background: "linear-gradient(135deg, #1A1008 0%, #120A04 100%)",
              border: "1px solid #2A1A0A",
              borderRadius: 10,
              padding: "18px 20px",
            }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{stat.icon}</div>
              <div style={{ fontSize: 28, fontWeight: "bold", color: "#FF6B35" }}>{stat.value}</div>
              <div style={{ fontSize: 12, color: "#F5F0E8", marginBottom: 2 }}>{stat.label}</div>
              <div style={{ fontSize: 11, color: "#6A5040" }}>{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* TAB: Dashboard */}
        {activeTab === "dashboard" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {/* By module stats */}
              <div style={{
                background: "#120A04",
                border: "1px solid #2A1A0A",
                borderRadius: 10,
                padding: 20,
              }}>
                <h3 style={{ margin: "0 0 16px", fontSize: 14, color: "#C0A08A", fontWeight: "normal", letterSpacing: 2, textTransform: "uppercase" }}>
                  Challenges par module
                </h3>
                {MODULES.map((mod, i) => {
                  const count = students.filter(s => s.challenges[i]).length;
                  const pct = Math.round((count / students.length) * 100);
                  return (
                    <div key={i} style={{ marginBottom: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 13 }}>{mod.emoji} Module {mod.id} — {mod.name}</span>
                        <span style={{ fontSize: 13, color: "#FF6B35" }}>{count}/{students.length}</span>
                      </div>
                      <div style={{ background: "#2A1A0A", borderRadius: 4, height: 6 }}>
                        <div style={{
                          width: `${pct}%`,
                          height: "100%",
                          background: `linear-gradient(90deg, ${mod.color}, #FF6B35)`,
                          borderRadius: 4,
                          transition: "width 0.5s ease",
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Student cards */}
              <div style={{
                background: "#120A04",
                border: "1px solid #2A1A0A",
                borderRadius: 10,
                padding: 20,
                maxHeight: 400,
                overflowY: "auto",
              }}>
                <h3 style={{ margin: "0 0 16px", fontSize: 14, color: "#C0A08A", fontWeight: "normal", letterSpacing: 2, textTransform: "uppercase" }}>
                  Mes soleils ☀️
                </h3>
                {sorted.map(student => {
                  const score = getScore(student);
                  const pct = Math.round((score / numModules) * 100);
                  const rank = getRank(students, student);
                  return (
                    <div
                      key={student.id}
                      onClick={() => setSelectedStudent(selectedStudent?.id === student.id ? null : student)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "10px 12px",
                        marginBottom: 8,
                        borderRadius: 8,
                        cursor: "pointer",
                        background: selectedStudent?.id === student.id ? "#2A1A0A" : "transparent",
                        border: selectedStudent?.id === student.id ? "1px solid #FF6B35" : "1px solid transparent",
                        transition: "all 0.2s",
                      }}
                    >
                      <div style={{
                        width: 36, height: 36, borderRadius: "50%",
                        background: "linear-gradient(135deg, #FF6B35, #C0392B)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 12, fontWeight: "bold", flexShrink: 0,
                      }}>
                        {student.avatar}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                          <span style={{ fontSize: 13 }}>{student.name}</span>
                          {getMedal(rank) && <span style={{ fontSize: 14 }}>{getMedal(rank)}</span>}
                        </div>
                        <div style={{ background: "#1A0A00", borderRadius: 3, height: 4 }}>
                          <div style={{
                            width: `${pct}%`,
                            height: "100%",
                            background: "linear-gradient(90deg, #FF6B35, #F7931E)",
                            borderRadius: 3,
                          }} />
                        </div>
                      </div>
                      <div style={{ fontSize: 12, color: "#FF6B35", fontWeight: "bold", flexShrink: 0 }}>
                        {score}/{numModules}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Student detail */}
            {selectedStudent && (
              <div style={{
                marginTop: 20,
                background: "#120A04",
                border: "1px solid #FF6B35",
                borderRadius: 10,
                padding: 20,
              }}>
                <h3 style={{ margin: "0 0 16px", fontSize: 14, color: "#FF6B35", fontWeight: "normal" }}>
                  Détail — {selectedStudent.name}
                </h3>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {MODULES.map((mod, i) => {
                    const done = selectedStudent.challenges[i];
                    return (
                      <div
                        key={i}
                        onClick={() => toggleChallenge(selectedStudent.id, i)}
                        style={{
                          padding: "10px 14px",
                          borderRadius: 8,
                          border: done ? `1px solid ${mod.color}` : "1px solid #2A1A0A",
                          background: done ? `${mod.color}20` : "#0D0D0D",
                          cursor: "pointer",
                          textAlign: "center",
                          minWidth: 90,
                          transition: "all 0.2s",
                        }}
                      >
                        <div style={{ fontSize: 18 }}>{done ? "✅" : "⬜"}</div>
                        <div style={{ fontSize: 11, marginTop: 4, color: done ? mod.color : "#6A5040" }}>
                          M{mod.id} {mod.name}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: Grid */}
        {activeTab === "grid" && (
          <div>
            <div style={{ marginBottom: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button
                onClick={() => setFilterModule(null)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 20,
                  border: filterModule === null ? "1px solid #FF6B35" : "1px solid #2A1A0A",
                  background: filterModule === null ? "#FF6B3520" : "transparent",
                  color: filterModule === null ? "#FF6B35" : "#8A7060",
                  cursor: "pointer",
                  fontSize: 12,
                  fontFamily: "Georgia, serif",
                }}
              >
                Toutes
              </button>
              {MODULES.map((mod, i) => (
                <button
                  key={i}
                  onClick={() => setFilterModule(filterModule === i ? null : i)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 20,
                    border: filterModule === i ? `1px solid ${mod.color}` : "1px solid #2A1A0A",
                    background: filterModule === i ? `${mod.color}20` : "transparent",
                    color: filterModule === i ? mod.color : "#8A7060",
                    cursor: "pointer",
                    fontSize: 12,
                    fontFamily: "Georgia, serif",
                  }}
                >
                  M{mod.id} {mod.emoji}
                </button>
              ))}
            </div>

            <div style={{
              background: "#120A04",
              border: "1px solid #2A1A0A",
              borderRadius: 10,
              overflow: "auto",
            }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #2A1A0A" }}>
                    <th style={{ padding: "14px 16px", textAlign: "left", color: "#C0A08A", fontWeight: "normal", letterSpacing: 1, whiteSpace: "nowrap" }}>
                      Élève
                    </th>
                    {MODULES.map((mod, i) => (
                      <th key={i} style={{
                        padding: "14px 10px",
                        textAlign: "center",
                        color: filterModule === i ? "#FF6B35" : "#C0A08A",
                        fontWeight: "normal",
                        fontSize: 11,
                        whiteSpace: "nowrap",
                      }}>
                        {mod.emoji} M{mod.id}
                      </th>
                    ))}
                    <th style={{ padding: "14px 16px", textAlign: "center", color: "#C0A08A", fontWeight: "normal" }}>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map(student => {
                    const score = getScore(student);
                    const rank = getRank(students, student);
                    return (
                      <tr key={student.id} style={{ borderBottom: "1px solid #1A0A00" }}>
                        <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{
                              width: 28, height: 28, borderRadius: "50%",
                              background: "linear-gradient(135deg, #FF6B35, #C0392B)",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: 10, fontWeight: "bold", flexShrink: 0,
                            }}>
                              {student.avatar}
                            </div>
                            <span>{student.name}</span>
                            {getMedal(rank) && <span>{getMedal(rank)}</span>}
                          </div>
                        </td>
                        {MODULES.map((mod, i) => (
                          <td key={i} style={{ padding: "12px 10px", textAlign: "center" }}>
                            <button
                              onClick={() => toggleChallenge(student.id, i)}
                              style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                fontSize: 18,
                                lineHeight: 1,
                                padding: 2,
                                opacity: student.challenges[i] ? 1 : 0.3,
                                transition: "all 0.2s",
                              }}
                              title={`Toggle ${mod.name}`}
                            >
                              {student.challenges[i] ? "✅" : "⬜"}
                            </button>
                          </td>
                        ))}
                        <td style={{ padding: "12px 16px", textAlign: "center" }}>
                          <span style={{
                            background: score === numModules ? "linear-gradient(135deg, #FF6B35, #F7931E)" : "#2A1A0A",
                            color: score === numModules ? "#fff" : "#FF6B35",
                            padding: "3px 10px",
                            borderRadius: 20,
                            fontSize: 12,
                            fontWeight: "bold",
                          }}>
                            {score}/{numModules}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: Leaderboard */}
        {activeTab === "leaderboard" && (
          <div>
            <div style={{ maxWidth: 600, margin: "0 auto" }}>
              {sorted.map((student, idx) => {
                const score = getScore(student);
                const pct = Math.round((score / numModules) * 100);
                const medal = getMedal(idx + 1);
                return (
                  <div
                    key={student.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      padding: "16px 20px",
                      marginBottom: 10,
                      borderRadius: 10,
                      background: idx === 0
                        ? "linear-gradient(135deg, #2D1A00, #3D2000)"
                        : "#120A04",
                      border: idx === 0
                        ? "1px solid #FF6B35"
                        : "1px solid #2A1A0A",
                    }}
                  >
                    <div style={{
                      width: 36, textAlign: "center",
                      fontSize: medal ? 24 : 16,
                      color: "#6A5040",
                      fontWeight: "bold",
                      flexShrink: 0,
                    }}>
                      {medal || `#${idx + 1}`}
                    </div>
                    <div style={{
                      width: 44, height: 44, borderRadius: "50%",
                      background: "linear-gradient(135deg, #FF6B35, #C0392B)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 14, fontWeight: "bold", flexShrink: 0,
                    }}>
                      {student.avatar}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, marginBottom: 6 }}>{student.name}</div>
                      <div style={{ background: "#1A0A00", borderRadius: 4, height: 6 }}>
                        <div style={{
                          width: `${pct}%`,
                          height: "100%",
                          background: idx === 0
                            ? "linear-gradient(90deg, #FF6B35, #F7931E)"
                            : "linear-gradient(90deg, #C0392B, #FF6B35)",
                          borderRadius: 4,
                          transition: "width 0.5s",
                        }} />
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontSize: 20, fontWeight: "bold", color: "#FF6B35" }}>{score}</div>
                      <div style={{ fontSize: 11, color: "#6A5040" }}>challenges</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Add student modal */}
      {showAddModal && (
        <div style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.8)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 100,
        }}>
          <div style={{
            background: "#1A0A00",
            border: "1px solid #FF6B35",
            borderRadius: 12,
            padding: 28,
            width: 340,
          }}>
            <h3 style={{ margin: "0 0 16px", color: "#FF6B35", fontWeight: "normal" }}>
              Ajouter une soleil ☀️
            </h3>
            <input
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addStudent()}
              placeholder="Prénom Nom"
              autoFocus
              style={{
                width: "100%",
                background: "#0D0D0D",
                border: "1px solid #2A1A0A",
                borderRadius: 6,
                padding: "10px 14px",
                color: "#F5F0E8",
                fontSize: 14,
                fontFamily: "Georgia, serif",
                boxSizing: "border-box",
                marginBottom: 16,
                outline: "none",
              }}
            />
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => { setShowAddModal(false); setNewName(""); }}
                style={{
                  flex: 1, padding: "10px", background: "transparent",
                  border: "1px solid #2A1A0A", borderRadius: 6,
                  color: "#8A7060", cursor: "pointer", fontSize: 13, fontFamily: "Georgia, serif",
                }}
              >
                Annuler
              </button>
              <button
                onClick={addStudent}
                style={{
                  flex: 1, padding: "10px", background: "#FF6B35",
                  border: "none", borderRadius: 6,
                  color: "#fff", cursor: "pointer", fontSize: 13, fontFamily: "Georgia, serif",
                }}
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
